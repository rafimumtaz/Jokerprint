import { getProductById, updateProduct, getCategories } from '@/lib/actions';
import { ProductForm } from '@/components/ProductForm';
import { notFound } from 'next/navigation';

type EditProductPageProps = {
  params: { id: string };
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }
  
  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div className="space-y-6">
       <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Edit Product</h1>
        <p className="mt-2 text-muted-foreground">Modify the details for "{product.name}".</p>
      </div>
      <ProductForm 
        product={product} 
        action={updateProductWithId}
        submitButtonText="Update Product"
        categories={categories}
      />
    </div>
  );
}
