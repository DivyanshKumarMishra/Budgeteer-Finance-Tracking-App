import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const serializeObject = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) serialized.balance = Number(obj.balance);
  if (obj.amount) serialized.amount = Number(obj.amount);
  return serialized;
};

export async function checkUser() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const db_user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!db_user) throw new Error('User not found');
  return db_user;
}

export function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case 'DAILY':
      date.setDate(date.getDate() + 1);
      break;
    case 'WEEKLY':
      date.setDate(date.getDate() + 7);
      break;
    case 'MONTHLY':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'YEARLY':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}

export function isTransactionDue(txn) {
  if (!txn.lastProcessed) return true;
  return txn.nextRecurringDate <= new Date();
}
