import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from 'lucide-react';

// Use theme colors
const iconClass = "h-8 w-8 text-primary"; // primary green
const titleClass = "text-lg md:text-xl font-semibold text-muted-foreground text-center";
const descClass = "text-gray-200 text-sm md:text-base text-center";

// Features Data
export const featuresData = [
  {
    icon: <BarChart3 className={iconClass} />,
    title: 'Advanced Analytics',
    description:
      'Get detailed insights into your spending patterns with AI-powered analytics',
    titleClass,
    descClass,
  },
  {
    icon: <Receipt className={iconClass} />,
    title: 'Smart Receipt Scanner',
    description:
      'Extract data automatically from receipts using advanced AI technology',
    titleClass,
    descClass,
  },
  {
    icon: <PieChart className={iconClass} />,
    title: 'Budget Planning',
    description: 'Create and manage budgets with intelligent recommendations',
    titleClass,
    descClass,
  },
  {
    icon: <Zap className={iconClass} />,
    title: 'Automated Insights',
    description: 'Get automated financial insights and recommendations',
    titleClass,
    descClass,
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className={iconClass} />,
    title: '1. Create Your Account',
    description:
      'Get started in minutes with our simple and secure sign-up process',
    titleClass,
    descClass,
  },
  {
    icon: <BarChart3 className={iconClass} />,
    title: '2. Track Your Spending',
    description:
      'Automatically categorize and track your transactions in real-time',
    titleClass,
    descClass,
  },
  {
    icon: <PieChart className={iconClass} />,
    title: '3. Get Insights',
    description:
      'Receive AI-powered insights and recommendations to optimize your finances',
    titleClass,
    descClass,
  },
];