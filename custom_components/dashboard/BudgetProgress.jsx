'use client';

import { upsertBudget } from '@/actions/budget';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import useFetch from '@/hooks/UseFetch';
import { Check, Pencil, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

function BudgetProgress({ initialBudget, currentExpenses }) {
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ''
  );

  const [isEditing, setIsEditing] = useState(false);
  const {
    data: budgetData,
    loading: budgetLoading,
    error: budgetError,
    fn: upsertBudgetFn,
  } = useFetch(upsertBudget);

  const updateBudget = async () => {
    const amount = Number(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    await upsertBudgetFn(newBudget);
  };

  const percentageUsed = initialBudget
    ? (currentExpenses / initialBudget?.amount) * 100
    : 0;

  useEffect(() => {
    if (budgetData) {
      toast.success('Budget Updated');
      setIsEditing(false);
    }
  }, [budgetData, upsertBudgetFn]);

  useEffect(() => {
    if (budgetError) {
      toast.error('Failed to update budget');
    }
  }, [budgetError]);

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || '');
    setIsEditing(false);
  };

  // console.log(initialBudget, currentExpenses);

  return (
    <div className="px-3 md:px-6 lg:px-8">
      <Card className="w-full">
        <CardHeader className="flex flex-col md:flex-row items-center md:justify-between gap-2">
          <CardTitle className="text-2xl text-center md:text-left text-muted-foreground">
            Monthly Budget
          </CardTitle>

          {isEditing ? (
            <div className="flex gap-2 items-start md:items-center mt-4 md:mt-0">
              <Input
                type="number"
                value={newBudget}
                placeholder="Enter amount..."
                onChange={(e) => setNewBudget(e.target.value)}
                autoFocus
                disabled={budgetLoading}
                className="w-full xs:w-32 sm:w-40 md:w-48 border-gray-700"
              />

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={updateBudget}
                  disabled={budgetLoading}
                  className="text-accent hover:bg-accent hover:text-white"
                >
                  <Check className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={budgetLoading}
                  className="text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          ) : (
            <CardDescription className="text-lg ">
              {initialBudget
                ? `₹${currentExpenses.toFixed(
                    2
                  )} of ₹${initialBudget?.amount?.toFixed(2)} spent`
                : 'No budget set'}
              <Button
                variant="ghost"
                onClick={() => setIsEditing(true)}
                size="icon"
                className="ml-1 text-accent hover:bg-card hover:text-accent"
              >
                <Pencil className="h-6 w-6" />
              </Button>
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="text-sm sm:text-base md:text-lg">
          {budgetLoading ? (
            <BarLoader color="#059669" width={'100%'} className="mb-4" />
          ) : (
            initialBudget && (
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Progress
                      value={percentageUsed}
                      percentStyles={`${
                        percentageUsed >= 70
                          ? percentageUsed >= 90
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                  </div>
                  <p className="font-semibold text-sm text-muted-foreground">
                    {percentageUsed.toFixed(2)}% used
                  </p>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BudgetProgress;
