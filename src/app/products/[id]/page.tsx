import { getProductById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type ProductDetailPageProps = {
  params: { id: string };
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 md:px-6 lg:px-8">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <CardTitle className="mb-4 font-headline text-3xl md:text-4xl">{product.name}</CardTitle>
          <p className="text-muted-foreground">{product.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
