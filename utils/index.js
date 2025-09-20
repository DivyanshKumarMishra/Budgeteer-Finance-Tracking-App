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
