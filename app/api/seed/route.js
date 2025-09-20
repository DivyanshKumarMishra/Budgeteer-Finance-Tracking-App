import { seedTransactions } from '@/data/transaction_seed';

export async function GET() {
  const result = await seedTransactions();
  return Response.json(result);
}
