import { Suspense } from 'react';
import Header from '@/components/Header';
import ProductCatalog from '@/components/ProductCatalog';
import { getProducts, getCategories } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { getSession } from '@/lib/auth';
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || '';
  const session = await getSession();

  // Fetch data
  let products = [];
  let categories = [];
  try {
     products = await getProducts(query);
     categories = await getCategories();
  } catch (e) {
     console.error("Database unavailable, using mock data for display.");
     // Fallback mock data if DB is not connected (for verification/UI design purposes)
     products = [
        { id: '1', name: 'Artpaper 120', price: 50000, imageUrl: '/uploads/placeholder.jpg', status: 'available', categoryId: 'cat1' },
        { id: '2', name: 'Banner', price: 150000, imageUrl: '/uploads/placeholder.jpg', status: 'available', categoryId: 'cat3' },
        { id: '3', name: 'Kartu Nama', price: 35000, imageUrl: '/uploads/placeholder.jpg', status: 'unavailable', categoryId: 'cat7' },
     ] as any;
     categories = [
        { id: 'cat1', name: 'Cetak Warna' },
        { id: 'cat3', name: 'Cetak Besar' },
        { id: 'cat7', name: 'Special Offer' },
     ] as any;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">

        {/* HERO SECTION */}
        <section id="beranda" className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
          {/* Background Image */}
          <div
             className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: "url('/background.png')" }}
          >
             <div className="absolute inset-0 bg-black/40" /> {/* Overlay for text readability */}
          </div>

          <div className="relative z-10 container mx-auto px-4 text-white space-y-6">
             <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-md">
               Solusi Cetak Cepat & Berkualitas
             </h1>
             <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90 drop-shadow-sm">
               JokerDigiPrint melayani segala kebutuhan cetak digital Anda dengan harga bersaing dan kualitas terbaik.
             </p>
             <div className="flex justify-center gap-4 pt-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 text-lg shadow-lg border-2 border-transparent hover:border-white/50 transition-all">
                  <Link href="#produk">Lihat Produk</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary rounded-full px-8 text-lg shadow-lg backdrop-blur-sm">
                  <Link href="#tentang-kami">Hubungi Kami</Link>
                </Button>
             </div>
          </div>
        </section>

        {/* PRODUK SECTION */}
        <section id="produk" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-10 text-center space-y-2">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-primary">
                Katalog Produk
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Temukan berbagai layanan cetak dan desain sesuai kebutuhan Anda. Gunakan filter untuk mencari produk lebih spesifik.
              </p>
            </div>

            <Suspense key={query} fallback={<ProductGridSkeleton />}>
              <ProductCatalog
                initialProducts={products}
                categories={categories}
                session={session}
              />
            </Suspense>
          </div>
        </section>

        {/* TENTANG KAMI SECTION */}
        <section id="tentang-kami" className="relative py-16 md:py-24 text-white">
           <div
             className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: "url('/background.png')" }}
          >
             <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" /> {/* Tint with primary color */}
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-white mb-8">
              Tentang Kami
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                <h3 className="font-bold text-xl mb-4 text-accent">Alamat</h3>
                <p className="text-white/90">
                  Jalan Raya Cetak No. 88<br/>
                  Jakarta Barat, DKI Jakarta<br/>
                  Indonesia, 11000
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                <h3 className="font-bold text-xl mb-4 text-accent">Kontak</h3>
                <p className="text-white/90">
                  Telp: (021) 1234-5678<br/>
                  WhatsApp: 0812-3456-7890<br/>
                  Email: info@jokerdigiprint.com
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                <h3 className="font-bold text-xl mb-4 text-accent">Jam Operasional</h3>
                <p className="text-white/90">
                  Senin - Jumat: 08.00 - 20.00 WIB<br/>
                  Sabtu: 09.00 - 17.00 WIB<br/>
                  Minggu: Libur
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20 text-sm text-white/70">
              © {new Date().getFullYear()} JokerDigiPrint. All rights reserved.
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
