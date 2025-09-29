import { defaultCategories } from '@/data/categories';

export const defaultValues = {
  account: {
    name: '',
    type: 'CURRENT',
    balance: '',
    isDefault: false,
  },
  transaction: {
    type: '',
    amount: '',
    accountId: '',
    description: '',
    date: '',
    category: '',
    isRecurring: false,
    recurringInterval: '',
  },
};

export const accountFields = [
  {
    field: 'name',
    type: 'text',
    label: 'Account Name',
    placeholder: 'e.g., Work Account',
  },
  {
    field: 'type',
    type: 'select',
    label: 'Account Type',
    options: ['CURRENT', 'SAVINGS'],
    placeholder: 'Select Account Type',
  },
  {
    field: 'balance',
    type: 'number',
    label: 'Balance',
    placeholder: '0.0',
    step: '0.01',
  },
  {
    field: 'isDefault',
    label: 'Set as Default',
    type: 'switch',
    subtext: 'This will be default account for all transactions.',
  },
];

export const transactionFields = [
  {
    field: 'type',
    type: 'select',
    label: 'Type',
    options: ['INCOME', 'EXPENSE'],
    placeholder: 'Select Transaction Type',
  },
  {
    field: 'amount',
    type: 'number',
    label: 'Amount',
    placeholder: '0.0',
    step: '0.01',
  },
  {
    field: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'e.g., Salary, Groceries, etc.',
  },
  {
    field: 'accountId',
    type: 'select',
    label: 'Account',
    placeholder: 'Select Account',
  },
  {
    field: 'date',
    type: 'date',
    label: 'Transaction Date',
  },
  {
    field: 'category',
    type: 'select',
    label: 'Category',
    options: defaultCategories.map((category) => category.name),
    placeholder: 'Select Category',
  },
  {
    field: 'isRecurring',
    label: 'Set as Recurring Transaction',
    type: 'switch',
    subtext:
      'This transaction will repeat automatically based on the interval.',
  },
  {
    field: 'recurringInterval',
    type: 'select',
    label: 'Recurring Interval',
    options: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    placeholder: 'Select Interval',
  },
];

export const input_fields = {
  account: accountFields,
  transaction: transactionFields,
};
