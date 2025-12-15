'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteProduct } from '@/lib/actions';
import { toast } from '@/hooks/use-toast';
import { Session } from 'next-auth';
import { MouseEvent } from 'react';

type ProductCardProps = {
  product: Product;
  session: Session | null;
};

export default function ProductCard({ product, session }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      toast({
        title: 'Success!',
        description: 'Product has been deleted.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  const handleAdminAction = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="block">
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <CardTitle className="mb-2 font-headline text-lg group-hover:underline">
            {product.name}
          </CardTitle>
          <div className="flex items-center justify-between mt-3">
             <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
             <span className={`px-2 py-1 text-xs rounded-full border ${
               (product as any).status === 'available'
                 ? 'bg-green-100 text-green-700 border-green-200'
                 : 'bg-red-100 text-red-700 border-red-200'
             }`}>
               {(product as any).status === 'available' ? 'Tersedia' : 'Habis'}
             </span>
          </div>
        </CardContent>
      </Link>
      {isAdmin && (
        <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
          <Button asChild variant="outline" onClick={handleAdminAction}>
            <Link href={`/products/${product.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" onClick={handleAdminAction}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this
                  product and remove all of its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}
