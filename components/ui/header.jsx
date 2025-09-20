import Navbar, { NavLinks } from '@/custom_components/navbar';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { upsertUser } from '@/lib/user';

const Header = async () => {
  await upsertUser();
  return (
    <>
      <header className="fixed top-0 w-full flex items-center justify-between px-6 lg:px-12 py-4 border-b border-border bg-background z-50">
        <Link href="/">
          <Logo className="text-3xl font-extrabold" />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:block">
          <NavLinks />
        </div>

        {/* mobile navigation */}
        <Navbar />
      </header>

      {/* Spacer to offset fixed header */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Header;
