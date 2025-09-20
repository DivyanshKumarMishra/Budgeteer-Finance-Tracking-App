import { currentUser } from '@clerk/nextjs/server';
import prisma from './prisma';

export const upsertUser = async () => {
  const user = await currentUser();

  // save user details in supabase db when user registers on app
  if (!user) return null;
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (dbUser) return dbUser;
  const new_user = await prisma.user.create({
    data: {
      firstname: user.firstName,
      lastname: user.lastName,
      clerkUserId: user.id,
      name: user.name,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
    },
  });

  return new_user;
};
