'use server';

import { receipt_scan_prompt } from '@/data/gemini_prompts';
import aj from '@/lib/arcjet';
import prisma from '@/lib/prisma';
import {
  calculateNextRecurringDate,
  checkUser,
  serializeObject,
} from '@/utils';
import { request } from '@arcjet/next';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { revalidatePath } from 'next/cache';

const genAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function addTransaction(data) {
  try {
    const db_user = await checkUser();
    const { userId } = await auth();
    // console.log(data)

    const req = await request();

    const decision = await aj.protect(req, { userId, requested: 1 });

    if (decision?.isDenied()) {
      if (decision?.reason?.isRateLimit()) {
        const { remaining, reset } = decision?.reason;
        console.error({
          code: 'RATE_LIMIT_EXCEEDED',
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error('Too many requests, please try again later');
      }

      throw new Error('Request blocked');
    }

    const account = await prisma.account.findUnique({
      where: { id: data.accountId, userId: db_user.id },
    });

    if (!account) throw new Error('Account not found');

    const balanceChange = data.type === 'EXPENSE' ? -data.amount : data.amount;
    const newBalance = Number(account.balance) + balanceChange;

    const transaction = await prisma.$transaction(async (txn) => {
      const new_transaction = await txn.transaction.create({
        data: {
          ...data,
          userId: db_user.id,
          accountId: account.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await txn.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });

      return new_transaction;
    });

    if (!transaction) throw new Error('Failed to create transaction');

    revalidatePath('/dashboard');
    revalidatePath(`account/${data.accountId}`);

    return { success: true, data: serializeObject(transaction) };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
}

export async function scanReceipt(file) {
  try {
    const db_user = await checkUser();

    // Convert to array buffer
    const buffer = await file.arrayBuffer();

    // Convert to base64
    const base64String = Buffer.from(buffer).toString('base64');

    const result = await genAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64String,
              mimeType: file.type,
            },
          },
          {
            text: receipt_scan_prompt,
          },
        ],
      },
    });

    const cleanedText = result.text?.replace(/```(?:json)?\n?/g, '').trim();
    try {
      const parsedData = JSON.parse(cleanedText);
      return {
        success: true,
        data: {
          ...parsedData,
          amount: parseFloat(parsedData.amount),
          date: new Date(parsedData.date),
        },
      };
    } catch (error) {
      throw new Error('Invalid response format from Gemini');
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getTransaction(txnId, data) {
  try {
    const db_user = await checkUser();

    if (!txnId) throw new Error('Transaction ID is required');

    const transaction = await prisma.transaction.findUnique({
      where: { id: txnId, userId: db_user.id },
    });

    if (!transaction) throw new Error('Transaction not found');
    return { success: true, data: serializeObject(transaction) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function editTransaction(txnId, data) {
  try {
    const db_user = await checkUser();

    if (!txnId) throw new Error('Transaction ID is required');

    const transaction = await prisma.transaction.findUnique({
      where: { id: txnId, userId: db_user.id },
      include: { account: true },
    });

    if (!transaction) throw new Error('Transaction not found');

    const balanceChanged =
      Number(transaction.amount).toFixed(2) !== Number(data.amount).toFixed(2);

    const updatedTransaction = await prisma.$transaction(async (txn) => {
      if (balanceChanged) {
        const oldBalanceChange =
          transaction.type === 'EXPENSE'
            ? -transaction.amount
            : transaction.amount;
        const newBalanceChange =
          data.type === 'EXPENSE' ? -data.amount : data.amount;

        const netBalanceChange = newBalanceChange - oldBalanceChange;
        await txn.account.update({
          where: { id: transaction.accountId, userId: db_user.id },
          data: { balance: { increment: netBalanceChange } },
        });
      }

      const updated_txn = await txn.transaction.update({
        where: {
          id: transaction.id,
          userId: db_user.id,
        },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      return updated_txn;
    });

    revalidatePath('/dashboard');
    revalidatePath(`account/${transaction.accountId}`);

    return { success: true, data: serializeObject(updatedTransaction) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
