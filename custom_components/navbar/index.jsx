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
import { Menu, Plus } from 'lucide-react';

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
const NavLink = ({ href, children, special = false }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative inline-block px-4 py-2 rounded transition-all duration-300
    ${
      special
        ? 'bg-gradient-to-br from-green-400 via-teal-400 to-blue-300 transaction-pulse-on-hover text-background hover:font-semibold'
        : `${
            isActive
              ? 'bg-gradient-to-br from-green-400 via-teal-400 to-blue-300 bg-clip-text text-transparent shadow-[0_0_7px_#059669,0_0_7px_#059669,0_0_7px_#059669]'
              : 'text-accent link-pulse-on-hover gradient-text'
          }`
    }
  `}
    >
      {children}
    </Link>
  );
};

export const NavLinks = () => (
  <nav className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 h-full">
    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
      <NavLink href="/dashboard">Dashboard</NavLink>
      <NavLink href="/transaction/create" special={true}>
        <span className="flex items-center gap-1">
          <Plus />
          Add transaction
        </span>
      </NavLink>
      <SignedOut>
        <SignInButton>
          <NavLink href="/sign-in">Sign in</NavLink>
        </SignInButton>
        <SignUpButton>
          <NavLink href="/sign-up">Sign up</NavLink>
        </SignUpButton>
      </SignedOut>
    </div>

    <div className="mt-auto">
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
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
