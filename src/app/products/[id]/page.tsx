import { getProductById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
          <p className="mb-6 text-3xl font-bold">{formatPrice(product.price)}</p>
          <p className="text-muted-foreground">{product.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
