import { serve } from 'inngest/next';
import {
  generateMonthlyReports,
  processRecurringTransactions,
  SendBudgetAlerts,
  triggerRecurringTransactions,
} from '@/lib/inngest/functions';
import { inngest } from '@/lib/inngest/client';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    SendBudgetAlerts,
    triggerRecurringTransactions,
    processRecurringTransactions,
    generateMonthlyReports,
  ],
});
