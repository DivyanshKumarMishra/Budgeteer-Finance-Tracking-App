'use server';

import prisma from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkUser, serializeObject } from '@/utils';

export async function createAccount(data) {
  try {
    const db_user = await checkUser();

    const balanceFloat = parseFloat(data.balance);

    if (isNaN(balanceFloat)) throw new Error('Invalid balance amount');

    // check if this the first account user is creating
    const exist_accs = await prisma.account.findMany({
      where: { userId: db_user.id },
    });

    const shouldBeDefault = exist_accs.length === 0 ? true : data.isDefault;
    if (shouldBeDefault) {
      await prisma.account.updateMany({
        where: { userId: db_user.id, isDefault: true },
        data: {
          isDefault: false,
        },
      });
    }

    const new_acc_body = {
      ...data,
      balance: balanceFloat,
      userId: db_user.id,
      isDefault: shouldBeDefault,
    };

    const new_acc = await prisma.account.create({ data: new_acc_body });
    revalidatePath('/dashboard');
    return { success: true, data: serializeObject(new_acc) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function fetchAccounts() {
  try {
    const db_user = await checkUser();

    const accounts = await prisma.account.findMany({
      where: { userId: db_user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { transactions: true } },
      },
    });
    return { success: true, data: accounts.map((acc) => serializeObject(acc)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
