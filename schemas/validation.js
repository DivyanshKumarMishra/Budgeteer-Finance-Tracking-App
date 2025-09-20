import { z } from 'zod';

const accountSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  type: z.enum(['CURRENT', 'SAVINGS']),
  balance: z.string().min(1, 'Balance is required'),
  isDefault: z.boolean(),
});

export const validationSchemas = {
  account: accountSchema,
};
