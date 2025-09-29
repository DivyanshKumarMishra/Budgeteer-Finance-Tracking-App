import { getCurrentBudget } from '@/actions/budget';
import { fetchAccounts, getDashboardData } from '@/actions/dashboard';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import EntityCreationDrawer from '@/custom_components/common/EntityCreationDrawer';
import BudgetProgress from '@/custom_components/dashboard/BudgetProgress';
import DashboardOverview from '@/custom_components/dashboard/DashboardOverview';
import { ArrowDownRightIcon, ArrowUpRightIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';

const AccountTrigger = () => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-full text-center text-muted-foreground">
      <PlusIcon className="h-10 w-10 text-primary hover:bg-primary hover:text-foreground rounded-full transition-colors" />
      <p className="text-xl">Add new account</p>
    </div>
  );
};

const RenderCardTrigger = ({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      <Card className="hover:shadow-md transition-shadow hover:shadow-accent h-full flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

const RenderAccountCard = ({ acc }) => {
  const { name, type, balance, isDefault, id } = acc;

  return (
    <Link href={`/account/${id}`} passHref>
      <div className="h-full">
        <Card className="h-full hover:shadow-md transition-shadow hover:shadow-accent flex flex-col cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-muted-foreground font-semibold text-center">
              {name}
            </CardTitle>
            <div className="flex justify-center items-center gap-2 mt-2">
              Default Account:
              <Switch defaultChecked={isDefault} disabled />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-muted-foreground">
              ₹{parseFloat(balance).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              {type.charAt(0) + type.slice(1).toLowerCase()} Account
            </p>
          </CardContent>
          <CardFooter className="flex justify-around border-t pt-2">
            <div className="flex items-center gap-1 text-accent text-sm font-medium">
              <ArrowUpRightIcon className="w-4 h-4" />
              Income
            </div>
            <div className="flex items-center gap-1 text-red-500 text-sm font-medium">
              <ArrowDownRightIcon className="w-4 h-4" />
              Expenses
            </div>
          </CardFooter>
        </Card>
      </div>
    </Link>
  );
};

async function DashboardPage() {
  const { success, data: userAccounts } = await fetchAccounts();

  const defaultAccount = userAccounts?.find((acc) => acc.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    const response = await getCurrentBudget(defaultAccount.id);
    budgetData = response.data;
  }

  const { data: transactions } = await getDashboardData();

  return (
    <div className="space-y-10 mb-5">
      {/* Budget Progress */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Overview */}
      <DashboardOverview transactions={transactions} accounts={userAccounts} />

      {/* Accounts Grid*/}
      <div className="flex flex-col gap-6 px-4 md:px-6 lg:px-8">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <EntityCreationDrawer
            trigger={
              <RenderCardTrigger>
                <AccountTrigger />
              </RenderCardTrigger>
            }
            title="Create New Account"
            useForm={true}
            formType="account"
          />
          {success &&
            userAccounts?.length > 0 &&
            userAccounts.map((acc) => (
              <RenderAccountCard key={acc.id} acc={acc} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
