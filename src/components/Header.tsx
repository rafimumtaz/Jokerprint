import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getSession } from '@/lib/auth';
import LogoutButton from './LogoutButton';
import Image from 'next/image';

export default async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
           {/* Logo - assuming it's available in public/LOGO.png */}
           <div className="relative h-10 w-10 overflow-hidden rounded-full">
             <Image src="/LOGO.png" alt="JokerDigiPrint Logo" fill className="object-cover" />
           </div>
          <span className="font-headline text-2xl font-bold text-primary">JokerDigiPrint</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/#beranda" className="text-foreground hover:text-primary transition-colors">
            Beranda
          </Link>
          <Link href="/#produk" className="text-foreground hover:text-primary transition-colors">
            Produk
          </Link>
          <Link href="/#tentang-kami" className="text-foreground hover:text-primary transition-colors">
            Tentang Kami
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {session?.user?.role === 'ADMIN' && (
            <Button asChild size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/products/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Product
              </Link>
            </Button>
          )}
          {session ? (
            <LogoutButton />
          ) : (
            <Button asChild className="bg-primary text-white hover:bg-primary/90 rounded-full px-6">
              <Link href="/login">Masuk</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
