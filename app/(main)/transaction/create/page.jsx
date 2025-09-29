import { getUserAccounts } from '@/actions/accounts';
import { getTransaction } from '@/actions/transaction';
import AddTransactionForm from '@/custom_components/transaction/AddTransactionForm';
import { Suspense } from 'react';
import { RingLoader } from 'react-spinners';

async function AddTransaction({ searchParams }) {
  const { data: userAccounts } = await getUserAccounts();
  const txnId = (await searchParams)?.edit;
  let db_transaction = null;

  if (txnId) {
    const result = await getTransaction(txnId);
    db_transaction = db_transaction = result?.data ? result.data : null;
  }

  const editMode = !!txnId;

  return (
    <div className="h-full flex flex-col gap-5 lg:gap-10">
      <h2 className="main-heading">{editMode ? 'Edit' : 'Add'} Transaction</h2>
      <Suspense
        fallback={
          <div className="h-full flex justify-center items-center">
            <RingLoader color="#059669" />
          </div>
        }
      >
        <AddTransactionForm
          accounts={userAccounts}
          transaction={db_transaction}
          edit={editMode}
        />
      </Suspense>
    </div>
  );
}

export default AddTransaction;
