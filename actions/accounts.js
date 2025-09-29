'use server';

import prisma from '@/lib/prisma';
import { checkUser, serializeObject } from '@/utils';
import { revalidatePath } from 'next/cache';

export async function getAccountWithTransactions(accId) {
  try {
    const db_user = await checkUser();

    if (!accId) throw new Error('Account ID is required');

    const account = await prisma.account.findUnique({
      where: { id: accId, userId: db_user.id },
      include: {
        transactions: { orderBy: { createdAt: 'desc' } },
        _count: { select: { transactions: true } },
      },
    });

    if (!account) return null;

    const serializedAcc = serializeObject(account);
    const accWithTransactions = {
      ...serializedAcc,
      transactions: account.transactions?.map((t) => serializeObject(t)) || [],
    };

    return { success: true, data: accWithTransactions };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function bulkDeleteTransactions(transactionIds, accId) {
  try {
    const db_user = await checkUser();

    const db_transactions = await prisma.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: db_user.id,
      },
    });

    const balanceChanges = db_transactions.reduce((acc, txn) => {
      const change = txn.type === 'EXPENSE' ? txn.amount : -txn.amount;
      acc[txn.accountId] = (acc[txn.accountId] || 0) + change;
      return acc;
    }, {});

    await prisma.$transaction(async (tx) => {
      // delete all transactions
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: db_user.id,
        },
      });

      //update account balance
      for (const [accId, change] of Object.entries(balanceChanges)) {
        await tx.account.update({
          where: { id: accId },
          data: { balance: { increment: change } },
        });
      }
    });

    revalidatePath('/dashboard');
    revalidatePath(`/account/${accId}`, 'page');

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUserAccounts() {
  try {
    const db_user = await checkUser();

    const accounts = await prisma.account.findMany({
      where: { userId: db_user.id },
    });

    return { success: true, data: accounts.map((acc) => serializeObject(acc)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
