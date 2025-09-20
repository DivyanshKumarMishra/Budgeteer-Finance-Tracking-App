import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/ui/header';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Budgeteer',
  description: 'Smart budgeting made easy, so you can focus on what matters.',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`flex flex-col h-screen ${inter.className}`}>
          <Header />
          <main className="flex-1 min-h-0 overflow-auto bg-background text-foreground p-6 lg:px-12 space-y-8 md:space-y-0 md:space-x-12">
            {children}
          </main>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
