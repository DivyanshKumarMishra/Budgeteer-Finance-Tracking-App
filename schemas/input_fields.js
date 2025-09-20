export const defaultValues = {
  account: {
    name: '',
    type: 'CURRENT',
    balance: '',
    isDefault: false,
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
  },
  { field: 'balance', type: 'number', label: 'Balance', placeholder: '0.0', step: '0.01' },
  { field: 'isDefault', label: 'Set as Default', type: 'switch' },
];

export const input_fields = {
  account: accountFields,
};
