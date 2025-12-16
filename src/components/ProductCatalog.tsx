'use client';

import { useState, useMemo } from 'react';
import { Product, Category } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Search } from '@/components/Search';

type ProductCatalogProps = {
  initialProducts: (Product & { category?: Category })[];
  categories: Category[];
  session: Session | null;
};

export default function ProductCatalog({
  initialProducts,
  categories,
  session,
}: ProductCatalogProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Filter by Category
      if (selectedCategoryIds.length > 0) {
        if (!product.categoryId || !selectedCategoryIds.includes(product.categoryId)) {
          return false;
        }
      }

      // Filter by Availability (Status)
      if (showAvailableOnly) {
        // Assuming status field exists or using default logic.
        // Since I couldn't run migration, 'status' might not be in the runtime object if using mock data,
        // but TypeScript expects it if I updated the type.
        // I'll cast product to any or check property safely if needed, but here I assume types are generated.
        // Based on the task, I added 'status' to schema.
        if ((product as any).status !== 'available') {
          return false;
        }
      }

      return true;
    });
  }, [initialProducts, selectedCategoryIds, showAvailableOnly]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border/50">
        <div className="flex-1 w-full md:max-w-md">
            <Search />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 border-primary/20 hover:border-primary/50 hover:bg-primary/5">
                <Filter className="mr-2 h-4 w-4" />
                Kategori
                {selectedCategoryIds.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 rounded-full px-1.5 text-xs font-normal">
                    {selectedCategoryIds.length}
                  </Badge>
                )}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
              <DropdownMenuLabel>Pilih Kategori</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={selectedCategoryIds.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
              {selectedCategoryIds.length > 0 && (
                 <>
                    <DropdownMenuSeparator />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs justify-center text-muted-foreground hover:text-primary"
                        onClick={() => setSelectedCategoryIds([])}
                    >
                        Reset Kategori
                    </Button>
                 </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Availability Filter */}
          <div className="flex items-center space-x-2 border rounded-md px-3 h-10 bg-background/50">
            <Switch
              id="available-mode"
              checked={showAvailableOnly}
              onCheckedChange={setShowAvailableOnly}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="available-mode" className="cursor-pointer text-sm font-medium">
              Tersedia Saja
            </Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              session={session}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 py-24 text-center">
            <h2 className="font-headline text-2xl font-semibold tracking-tight">
              Tidak ada produk ditemukan
            </h2>
            <p className="text-muted-foreground">
              Coba sesuaikan filter pencarian Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
