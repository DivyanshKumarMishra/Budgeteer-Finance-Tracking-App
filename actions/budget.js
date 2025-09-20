'use server';

import prisma from '@/lib/prisma';
import { checkUser } from '@/utils';
import { revalidatePath } from 'next/cache';

export async function getCurrentBudget(accountId) {
  try {
    const db_user = await checkUser();
    // console.log(accountId);

    const budget = await prisma.budget.findFirst({
      where: { userId: db_user.id },
    });

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
        userId: db_user.id,
        type: 'EXPENSE',
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      sucess: true,
      data: {
        budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
        currentExpenses: expenses?._sum?.amount
          ? expenses._sum.amount.toNumber()
          : 0,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function upsertBudget(amount) {
  try {
    const db_user = await checkUser();

    const budget = await prisma.budget.upsert({
      where: { userId: db_user.id },
      update: { amount },
      create: { userId: db_user.id, amount },
    });

    revalidatePath('/dashboard');

    return {
      success: true,
      data: { ...budget, amount: budget.amount.toNumber() },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
