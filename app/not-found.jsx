import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-bold gradient-title mb-4 bg-gradient-to-b from-green-400 to-green-700 bg-clip-text text-transparent text-6xl">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link href="/">
        <Button className="bg-accent gradient text-white hover:text-background" size='lg'>Return Home</Button>
      </Link>
    </div>
  );
}
