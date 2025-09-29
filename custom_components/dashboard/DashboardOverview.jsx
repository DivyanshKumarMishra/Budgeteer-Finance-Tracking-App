'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns/format';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

// Generate bright colors for dark background
const getBrightColorForCategory = (category) => {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360; // hue 0-359
  const s = 80; // high saturation for bright colors
  const l = 60; // lightness high so colors are vivid
  return `hsl(${h}, ${s}%, ${l}%)`;
};

function DashboardOverview({ transactions = [], accounts = [] }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((acc) => acc.isDefault)?.id || accounts[0]?.id
  );

  const accountTransactions = transactions.filter(
    (txn) => txn.accountId === selectedAccountId
  );

  // Get recent transactions (last 5)
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === 'EXPENSE' &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 md:px-6 lg:px-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-normal">
            Recent Transactions
          </CardTitle>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description || 'Untitled Transaction'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), 'PP')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`
                        flex flex-row items-center justify-center
                        ${
                          transaction.type === 'EXPENSE'
                            ? 'text-red-500'
                            : 'text-green-500'
                        }
                      `}
                    >
                      {transaction.type === 'EXPENSE' ? (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      )}
                      <span>₹{transaction.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal text-center">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No expenses this month
            </p>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={730} height={250}>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, value }) =>
                      window.innerWidth < 768
                        ? `₹${value.toFixed(2)}`
                        : `${name}: ₹${value.toFixed(2)}`
                    }
                    position="inside" // labels inside the slice
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={getBrightColorForCategory(entry.name)}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardOverview;
