import { Suspense } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Search } from '@/components/Search';
import { getProducts } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { getSession } from '@/lib/auth';
import { Session } from 'next-auth';

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

async function ProductGrid({
  query,
  session,
}: {
  query?: string;
  session: Session | null;
}) {
  const products = await getProducts(query);

  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              session={session}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 py-24 text-center">
          <h2 className="font-headline text-2xl font-semibold tracking-tight">
            No Products Found
          </h2>
          <p className="text-muted-foreground">
            Try adjusting your search or add a new product.
          </p>
        </div>
      )}
    </>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || '';
  const session = await getSession();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="space-y-1">
            <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Our Services
            </h1>
            <p className="text-muted-foreground">
              Browse, search, and manage our products.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <Search />
          </div>
        </div>

        <Suspense key={query} fallback={<ProductGridSkeleton />}>
          <ProductGrid query={query} session={session} />
        </Suspense>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Joker Catalog. All rights reserved.
      </footer>
    </div>
  );
}
