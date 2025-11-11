import { createProduct, getCategories } from '@/lib/actions';
import { ProductForm } from '@/components/ProductForm';

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Create New Product</h1>
        <p className="mt-2 text-muted-foreground">Fill in the details below to add a new service to the catalog.</p>
      </div>
      <ProductForm
        action={createProduct}
        submitButtonText="Create Product"
        categories={categories}
      />
    </div>
  );
}
