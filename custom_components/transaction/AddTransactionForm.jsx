'use client';

import {
  addTransaction,
  editTransaction,
  scanReceipt,
} from '@/actions/transaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormComponent from '@/custom_components/common/FormComponent';
import useFetch from '@/hooks/UseFetch';
import { defaultValues, input_fields } from '@/schemas/input_fields';
import { validationSchemas } from '@/schemas/validation';
import { Camera, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { set } from 'zod';

const loadingVerbs = {
  'add-transaction': 'Adding transaction',
  'edit-transaction': 'Updating transaction',
  'receipt-scan': 'Scanning receipt',
};

function AddTransactionForm({ accounts, transaction = null, edit = false }) {
  // console.log(edit, transaction);
  function getTransactionValues(txn) {
    return {
      type: txn.type,
      accountId: txn.accountId,
      amount: txn.amount.toString(),
      description: txn.description || '',
      category: txn.category,
      date: new Date(txn.date),
      isRecurring: txn.isRecurring,
      recurringInterval: txn.isRecurring ? txn.recurringInterval : '',
    };
  }

  const [defaultTransactionValues, setDefaultTransactionValues] = useState(
    edit && transaction
      ? getTransactionValues(transaction)
      : defaultValues.transaction
  );

  const [operationType, setOperationType] = useState('add-transaction');
  const receiptInputRef = useRef(null);

  useEffect(() => {
    if (edit && transaction) {
      setDefaultTransactionValues(getTransactionValues(transaction));
    } else {
      setDefaultTransactionValues(defaultValues.transaction);
    }
  }, [edit, transaction]);

  const {
    data: transactionData,
    loading: transactionLoading,
    error: transactionError,
    fn: transactionFn,
  } = useFetch(edit ? editTransaction : addTransaction);

  const {
    data: receiptData,
    loading: receiptDataLoading,
    error: receiptDataError,
    fn: scanReceiptFn,
  } = useFetch(scanReceipt);

  const account_options = accounts.map((acc) => ({
    key: acc.name,
    value: acc.id,
  }));
  const updated_input_fields = input_fields.transaction.map((input) =>
    input.field === 'accountId' ? { ...input, options: account_options } : input
  );

  const handleAddOrEditTransaction = async (data) => {
    // console.log(data)
    const formattedData = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => !(key !== 'description' && value === 'none')
      )
    );

    edit
      ? setOperationType('edit-transaction')
      : setOperationType('add-transaction');

    const transactionData = {
      ...formattedData,
      amount: parseFloat(formattedData.amount),
    };

    edit
      ? await transactionFn(transaction?.id, transactionData)
      : await transactionFn(transactionData);
  };

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Please select a file less than 5MB');
      return;
    }

    setOperationType('receipt-scan');
    await scanReceiptFn(file);
  };

  useEffect(() => {
    if (receiptData) {
      // console.log(receiptData);
      toast.success('Receipt scanned successfully');
      const { amount, category, description, date } = receiptData;
      const values = {
        ...defaultTransactionValues,
        amount: String(amount) ?? '',
        category: category?.charAt(0)?.toUpperCase() + category?.slice(1) ?? '',
        description: description ?? '',
        date: date ?? '',
      };

      setDefaultTransactionValues(values);
      receiptInputRef.current.value = null;
    }
  }, [receiptDataLoading]);

  useEffect(() => {
    if (receiptDataError) {
      toast.error('Failed to scan receipt');
    }
  }, [receiptDataError]);

  // console.log(accounts);
  // console.log(defaultValues.transaction, input_fields.transaction, validationSchemas.transaction);

  return (
    <div className="flex flex-col gap-10 justify-center items-center">
      {!edit && (
        <Button
          size="lg"
          className="bg-gradient-to-br from-green-400 via-teal-400 to-blue-300 transaction-pulse-on-hover hover:font-semibold text-base md:text-2xl w-full sm:w-2xl lg:w-4xl py-6"
          disabled={transactionLoading || receiptDataLoading}
          onClick={() => receiptInputRef.current.click()}
        >
          {receiptDataLoading ? (
            <>
              <Loader2 className="mr-2 size-6 animate-spin" />
              <span>Scanning receipt...</span>
            </>
          ) : (
            <>
              <Camera className="mr-2 size-6" />
              <span>Scan receipt with AI</span>
            </>
          )}
        </Button>
      )}
      <Input
        type="file"
        hidden
        ref={receiptInputRef}
        accept="image/*"
        onChange={(e) => handleReceiptScan(e.target.files[0])}
      />
      <FormComponent
        defaultValues={defaultTransactionValues}
        inputFields={updated_input_fields}
        validationSchema={validationSchemas.transaction}
        toastSuccessMsg={
          edit
            ? 'Transaction updated successfully'
            : 'Transaction added successfully'
        }
        toastErrorMsg={
          edit ? 'Failed to update transaction' : 'Failed to add transaction'
        }
        submitBtnText={edit ? 'Update transaction' : 'Add transaction'}
        loadingVerb={loadingVerbs[operationType]}
        loading={transactionLoading || receiptDataLoading}
        error={transactionError}
        data={transactionData}
        onSubmit={handleAddOrEditTransaction}
        className="px-1 w-full sm:w-2xl lg:w-4xl"
      />
    </div>
  );
}

export default AddTransactionForm;
