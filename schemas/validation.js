import { z } from 'zod';

const accountSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  type: z.preprocess(
    (val) => formatValue(val),
    z.enum(['CURRENT', 'SAVINGS'], 'Please select a valid account type')
  ),
  balance: z.string().min(1, 'Balance is required'),
  isDefault: z.boolean(),
});

const transactionSchema = z
  .object({
    type: z.preprocess(
      (val) => formatValue(val),
      z.enum(['EXPENSE', 'INCOME'], 'Please select a valid transaction type')
    ),
    amount: z.string().min(1, 'Amount is required'),
    description: z.string().optional(),
    date: z.preprocess(
      (val) => (val ? new Date(val) : null),
      z.date().nullable()
    ),
    accountId: z.preprocess(
      (val) => formatValue(val, true),
      z.string().min(1, 'Please select an account')
    ),
    category: z.preprocess(
      (val) => formatValue(val, true),
      z.string().min(1, 'Please select a category')
    ),
    isRecurring: z.boolean().default(false),
    recurringInterval: z.preprocess(
      (val) => formatValue(val),
      z.string().optional()
    ),
  })
  .superRefine((data, ctx) => {
    if (
      data.isRecurring &&
      (!data.recurringInterval || data.recurringInterval === 'none')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Recurring interval is required when transaction is recurring',
        path: ['recurringInterval'],
      });
    } else if (
      !data.isRecurring &&
      data.recurringInterval !== 'none' &&
      data.recurringInterval !== undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'This transaction is not recurring, remove the interval',
        path: ['recurringInterval'],
      });
    } else if (!data.date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date is required',
        path: ['date'],
      });
    } else if (data.date > new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date must be in the past',
        path: ['date'],
      });
    }

    return true;
  });

export const validationSchemas = {
  account: accountSchema,
  transaction: transactionSchema,
};

function formatValue(val, returnEmptyString = false) {
  if (val === null || val === undefined || val === '' || val === 'none') {
    return returnEmptyString ? '' : 'none';
  }

  return String(val);
}
