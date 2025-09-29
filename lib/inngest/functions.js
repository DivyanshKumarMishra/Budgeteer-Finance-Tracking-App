import { sendEmail } from '@/actions/sendEmail';
import prisma from '../prisma';
import { inngest } from './client';
import { calculateNextRecurringDate, isTransactionDue } from '@/utils';
import { generateMonthlyReportPrompt } from '@/data/gemini_prompts';
import { GoogleGenAI } from '@google/genai';

const genAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const SendBudgetAlerts = inngest.createFunction(
  {
    id: 'budget-alert',
    name: 'Budget Alert',
    retries: 2,
    retry: async (attempt) => ({
      delay: Math.pow(2, attempt) * 1000, // exponential backoff
    }),
  },
  { cron: '* */6 * * *' },
  async ({ step }) => {
    // fetch budgets for all users alongwith the user and default account information
    const budgets = await step.run('fetch budgets', async () => {
      return await prisma.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    // compare the expenses of default account of every user with the budget amount
    for (const budget of budgets) {
      const defaultUserAccount = budget.user.accounts[0];
      if (!defaultUserAccount) continue;

      // Step: check budget
      const { percentageUsed, totalExpenses, budgetAmount } = await step.run(
        `Check Budget - ${budget.id}`,
        async () => {
          const currentDate = new Date();
          const startOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          const endOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          );

          const expenses = await prisma.transaction.aggregate({
            where: {
              type: 'EXPENSE',
              date: {
                gte: startOfMonth,
                lte: endOfMonth,
              },
              accountId: defaultUserAccount.id,
            },
            _sum: {
              amount: true,
            },
          });

          const totalExpenses = Number(expenses._sum?.amount) || 0;
          const budgetAmount = Number(budget.amount);

          const percentageUsed = (totalExpenses / budgetAmount) * 100;

          return { percentageUsed, totalExpenses, budgetAmount };
        }
      );

      // console.log(percentageUsed, budgetAmount, totalExpenses);

      if (
        percentageUsed >= 80 &&
        (!budget.lastAlertSent ||
          isNewMonth(new Date(budget.lastAlertSent), new Date()))
      ) {
        await step.run(`Send Budget Alert - ${budget.id}`, async () => {
          // send email
          await sendEmail({
            user: budget.user,
            subject: `Budget Alert for ${defaultUserAccount.name}`,
            type: 'budget-alert',
            emailContent: {
              percentageUsed,
              budgetAmount: budgetAmount.toFixed(1),
              totalExpenses: totalExpenses.toFixed(1),
              accountName: defaultUserAccount.name,
            },
          });

          await prisma.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        });
      }
    }
  }
);

export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: 'trigger-recurring-transactions',
    name: 'Trigger Recurring Transactions',
    retries: 2,
    retry: async (attempt) => ({
      delay: Math.pow(2, attempt) * 1000, // exponential backoff
    }),
  },
  { cron: '0 0 * * *' },
  async ({ step }) => {
    const recurringTransactions = await step.run(
      'fetch-recurring-transactions',
      async () => {
        return await prisma.transaction.findMany({
          where: {
            isRecurring: true,
            status: 'COMPLETED',
            OR: [
              { lastProcessed: null },
              { nextRecurringDate: { lte: new Date() } },
            ],
          },
        });
      }
    );

    // create events for each transaction -> event batching
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((txn) => ({
        name: 'process-recurring-transaction',
        data: { transactionId: txn.id, userId: txn.userId },
      }));

      // send events to be processed
      await inngest.send(events);
    }
  }
);

export const processRecurringTransactions = inngest.createFunction(
  {
    id: 'process-recurring-transaction',
    name: 'Process Recurring Transaction',
    throttle: {
      limit: 10,
      period: '1m',
      key: 'event.data.userId',
    },
  },
  {
    event: 'process-recurring-transaction',
  },
  async ({ event, step }) => {
    // validate event data
    const { transactionId, userId } = event.data;
    if (!transactionId || !userId) {
      console.log('Invalid event data', event.data);
      return { error: 'Missing event data' };
    }

    await step.run('process-transaction', async () => {
      const transaction = await prisma.transaction.findUnique({
        where: {
          id: transactionId,
          userId,
        },
        include: {
          account: true,
        },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      console.log(transaction);

      await prisma.$transaction(async (txn) => {
        // create a new transaction
        await txn.transaction.create({
          data: {
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            description: `${transaction.description} (recurring)`,
            accountId: transaction.accountId,
            userId: transaction.userId,
            isRecurring: false,
            date: new Date(),
          },
        });

        // update account balance
        const balanceChange =
          transaction.type === 'EXPENSE'
            ? -Number(transaction.amount)
            : Number(transaction.amount);

        await txn.account.update({
          where: {
            id: transaction.accountId,
            userId: transaction.userId,
          },
          data: {
            balance: { increment: balanceChange },
          },
        });

        await txn.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);

export const generateMonthlyReports = inngest.createFunction(
  {
    name: 'Generate Monthly Reports',
    id: 'generate-monthly-reports',
  },
  { cron: '0 0 1 * *' },
  async ({ step }) => {
    const users = await step.run('fetch-users', async () => {
      return await prisma.user.findMany({ include: { accounts: true } });
    });

    for (const user of users) {
      const { stats, insights, monthName } = await step.run(
        'generate-monthly-report',
        async () => {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          const stats = await getMonthlyStats(user.id, lastMonth);
          const monthName = lastMonth.toLocaleString('default', {
            month: 'long',
          });

          const insights = await getFinancialInsights(stats, monthName);

          return { stats, insights, monthName };
        }
      );

      await step.run('send-monthly-report', async () => {
        await sendEmail({
          user,
          subject: `Financial Report for ${monthName}`,
          type: 'monthly-report',
          emailContent: {
            stats,
            insights,
            month: monthName,
          },
        });
      });
    }

    return { processed: users.length };
  }
);

async function getMonthlyStats(userId, month) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return transactions.reduce(
    (stats, txn) => {
      const { amount, type, category } = txn;
      const absAmount = Number(amount);
      if (type === 'EXPENSE') {
        stats.totalExpense += absAmount;
        stats.byCategory[category] =
          (stats.byCategory[category] || 0) + absAmount;
      } else {
        stats.totalIncome += absAmount;
      }

      return stats;
    },
    {
      totalIncome: 0,
      totalExpenses: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
}

async function getFinancialInsights(stats, monthName) {
  try {
    const result = await genAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: generateMonthlyReportPrompt(stats, monthName).trim(),
          },
        ],
      },
    });

    const cleanedText = result.text?.replace(/```(?:json)?\n?/g, '').trim();
    try {
      const parsedData = JSON.parse(cleanedText);
      return parsedData;
    } catch (error) {
      throw new Error('Invalid response format from Gemini');
    }
  } catch (error) {
    console.log(error);
    return [
      'Your highest expense category this month might need attention.',
      'Consider setting up a budget for better financial management.',
      'Track your recurring expenses to identify potential savings.',
    ];
  }
}

function isNewMonth(lastAlertSent, currentDate) {
  return (
    lastAlertSent.getMonth() !== currentDate.getMonth() ||
    lastAlertSent.getFullYear() !== currentDate.getFullYear()
  );
}
