import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { signOut } from 'next-auth/react';

export default async function Header() {
  const session = await getSession();

  const handleLogout = async () => {
    'use server';
    await signOut({ redirectTo: '/' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6">
            <rect width="256" height="256" fill="none" />
            <path
              d="M88,148a28,28,0,1,1,28-28"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            />
            <path
              d="M144,148a28,28,0,1,1,28-28"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            />
            <path
              d="M104.3,189.4a36,36,0,0,1,47.4,0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            />
            <path
              d="M208,80v96a16,16,0,0,1-16,16H64a16,16,0,0,1-16-16V80A16,16,0,0,1,64,64H80l40-40,40,40h16A16,16,0,0,1,208,80Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            />
          </svg>
          <span className="font-headline text-xl font-bold">Joker Catalog</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {session?.user?.role === 'ADMIN' && (
            <Button asChild>
              <Link href="/products/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Product
              </Link>
            </Button>
          )}
          {session ? (
            <form action={handleLogout}>
              <Button type="submit">Logout</Button>
            </form>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
