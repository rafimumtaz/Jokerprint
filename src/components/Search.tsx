'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  useEffect(() => {
    setQuery(searchParams.get('query') || '');
  }, [searchParams]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    router.push(`/?${params.toString()}#produk`);
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center gap-3">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="query"
          placeholder="Banner"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 h-10 rounded-full bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20"
        />
      </div>
      <Button
        type="submit"
        className="rounded-full bg-orange-200 hover:bg-orange-300 text-orange-700 font-medium px-6"
      >
        Cari
      </Button>
    </form>
  );
}
