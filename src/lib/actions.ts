
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { products } from './data';
import type { Product } from './types';
import { semanticProductSearch } from '@/ai/flows/semantic-product-search';

const ProductFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters."}),
  description: z.string().min(10, { message: "Description must be at least 10 characters."}),
  price: z.coerce.number().positive({ message: "Price must be a positive number."}),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(Boolean)),
  images: z.string().transform(val => val.split(',').map(img => img.trim()).filter(Boolean)),
});

// Get all products, with optional AI-powered search
export async function getProducts(query?: string): Promise<Product[]> {
  // A small delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  if (query) {
    try {
      const searchResults = await semanticProductSearch({
        query: query,
        products: products.map(p => ({ name: p.name, description: p.description })),
      });
      
      const resultSet = new Set(searchResults.map(p => p.name));
      return products.filter(p => resultSet.has(p.name));
    } catch (error) {
      console.error('AI search failed, falling back to basic search:', error);
      const lowerCaseQuery = query.toLowerCase();
      return products.filter(p => 
        p.name.toLowerCase().includes(lowerCaseQuery) ||
        p.description.toLowerCase().includes(lowerCaseQuery) ||
        p.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
    }
  }
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return products.find(p => p.id === id);
}

export async function createProduct(formData: FormData) {
  const validatedFields = ProductFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    throw new Error('Invalid product data.');
  }

  const { name, description, price, tags, images } = validatedFields.data;

  const newProduct: Product = {
    id: String(Date.now()),
    name,
    description,
    price,
    tags,
    images: images.length > 0 ? images : ['https://picsum.photos/seed/default/600/400'],
  };

  products.unshift(newProduct);
  revalidatePath('/');
  redirect('/');
}

export async function updateProduct(id: string, formData: FormData) {
  const product = await getProductById(id);
  if (!product) {
    throw new Error('Product not found.');
  }
  
  const validatedFields = ProductFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    throw new Error('Invalid product data.');
  }

  const { name, description, price, tags, images } = validatedFields.data;

  const updatedProduct: Product = {
    id,
    name,
    description,
    price,
    tags,
    images: images.length > 0 ? images : ['https://picsum.photos/seed/default/600/400'],
  };

  const productIndex = products.findIndex(p => p.id === id);
  products[productIndex] = updatedProduct;

  revalidatePath('/');
  revalidatePath(`/products/${id}/edit`);
  redirect('/');
}
