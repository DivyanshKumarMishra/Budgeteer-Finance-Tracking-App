'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

function QuickAction() {
  return (
    <div className="flex flex-col items-center text-center gap-y-5 bg-gradient-to-r from-green-400 via-teal-400 to-blue-300 text-background rounded-xl p-12 md:p-16 shadow-lg animate-fadeIn my-10">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        Ready to take control of your expenses?
      </h2>
      <p className="text-lg md:text-xl text-gray-800 max-w-xl">
        Get started today and turn your financial goals into reality with
        Budgeteer.
      </p>
      <Link href="/dashboard">
        <Button
          size="lg"
          className="mt-2 bg-white text-background font-bold rounded-lg px-8 py-4 shadow-lg transform transition duration-500 animate-bounce
             hover:animate-none hover:scale-110 hover:shadow-2xl hover:bg-gradient-to-r hover:from-blue-800  hover:via-teal-700 hover:to-green-600 hover:text-white"
        >
          Get Started
        </Button>
      </Link>
    </div>
  );
}

export default QuickAction;
