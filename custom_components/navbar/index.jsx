'use client';

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';

import Logo from '@/components/ui/Logo';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// NavLink component with active/selected logic
const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`inline-block px-4 py-2 rounded transition-colors duration-200 ${
        isActive
          ? 'bg-accent text-primary-foreground'
          : 'text-foreground hover:bg-card hover:text-accent'
      }`}
    >
      {children}
    </Link>
  );
};

export const NavLinks = () => (
  <nav className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
    <NavLink href="/dashboard">Dashboard</NavLink>
    <NavLink href="/budgets">Budgets</NavLink>
    <NavLink href="/expenses">Expenses</NavLink>
    <SignedIn>
      <UserButton />
    </SignedIn>
    <SignedOut>
      <SignInButton>
        <NavLink href="/sign-in">Sign in</NavLink>
      </SignInButton>
      <SignUpButton>
        <NavLink href="/sign-up">Sign up</NavLink>
      </SignUpButton>
    </SignedOut>
  </nav>
);

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="p-1 flex items-center justify-center"
        >
          <Menu className="text-accent" style={{ width: 24, height: 24 }} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-4">
        <SheetHeader className="text-3xl">
          <SheetTitle>
            <Link href="/">
              <Logo className="text-3xl font-extrabold" />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <NavLinks />
      </SheetContent>
    </Sheet>
  ) : null;
}

export default Navbar;
