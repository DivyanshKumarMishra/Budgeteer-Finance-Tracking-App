'use client';

import { CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { endOfDay } from 'date-fns/endOfDay';
import { format } from 'date-fns/format';
import { startOfDay } from 'date-fns/startOfDay';
import { subDays } from 'date-fns/subDays';
import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DATE_RANGES = {
  '7D': { label: 'Last 7 Days', days: 7 },
  '1M': { label: 'Last Month', days: 30 },
  '3M': { label: 'Last 3 Months', days: 90 },
  '6M': { label: 'Last 6 Months', days: 180 },
  ALL: { label: 'All Time', days: null },
};

function AccountChart({ transactions = [] }) {
  const [dateRange, setDateRange] = useState('1M');

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (txn) =>
        new Date(txn.date) >= startDate && new Date(txn.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, txn) => {
      const date = format(new Date(txn.date), 'MMM dd');

      if (!acc[date]) {
        acc[date] =
          txn.type === 'INCOME'
            ? { date, income: txn.amount, expense: 0 }
            : { date, income: 0, expense: txn.amount };
      } else {
        acc[date] =
          txn.type === 'INCOME'
            ? { ...acc[date], income: acc[date].income + txn.amount }
            : { ...acc[date], expense: acc[date].expense + txn.amount };
      }

      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => {
        acc.income += day.income;
        acc.expense += day.expense;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  // console.log(filteredData);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl md:text-2xl text-muted-foreground font-semibold">
          Transactions Overview
        </h2>
        <Select onValueChange={(value) => setDateRange(value)}>
          <SelectTrigger className="border-gray-700 w-[180px]">
            {DATE_RANGES[dateRange]?.label}
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-lg font-bold text-green-500">
            ₹{totals.income.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-lg font-bold text-red-500">
            ₹{totals.expense.toFixed(2)}
          </p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <p className="text-sm text-muted-foreground">Net</p>
          <p
            className={`text-lg font-bold ${
              totals.income > totals.expense ? 'text-green-500' : 'text-red-500'
            }`}
          >
            ₹{(totals.income - totals.expense).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" color="black" />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              labelStyle={{ color: 'black', fontWeight: 600 }}
              formatter={(value) => [`₹${value}`, undefined]}
              cursor={{ fill: 'rgba(59, 130, 246, 0.2)' }}
            />
            <Legend />
            <Bar
              dataKey="income"
              name="Income"
              fill="#059669"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#dc2626"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AccountChart;
