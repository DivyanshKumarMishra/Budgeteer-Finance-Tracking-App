import { getAccountWithTransactions } from '@/actions/accounts';
import AccountChart from '@/custom_components/account/AccountChart';
import TransactionTable from '@/custom_components/account/TransactionTable';
import { notFound } from 'next/navigation';
import React from 'react';

async function AccountDetails({ params }) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) notFound();
  const { transactions, ...account } = accountData.data;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8 mx-auto">
      {/* Account Info */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Account Name and Type */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            {account.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            {account.type?.charAt(0).toUpperCase() +
              account.type?.slice(1).toLowerCase()}{' '}
            Account
          </p>
        </div>

        {/* Account Balance and Transactions */}
        <div className="text-center md:text-right">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            ₹{parseFloat(account.balance || 0).toFixed(2)}
          </h2>
          <p className="text-lg text-muted-foreground">
            {account._count?.transactions || 0} Transactions
          </p>
        </div>
      </div>

      {/* Chart Section Placeholder */}
      <div className="bg-card p-4 rounded-lg shadow-sm">
        <AccountChart transactions={transactions} />
      </div>

      {/* Transactions Table Placeholder */}
      <div className="bg-card py-4 rounded-lg shadow-sm">
        <TransactionTable transactions={transactions} accountId={id} />
      </div>
    </div>
  );
}

export default AccountDetails;
