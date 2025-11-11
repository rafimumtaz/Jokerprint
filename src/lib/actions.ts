
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from './prisma';
import { semanticProductSearch } from '@/ai/flows/semantic-product-search';
import { Product, Category } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const ProductFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters."}),
  description: z.string().min(10, { message: "Description must be at least 10 characters."}),
  price: z.coerce.number().positive({ message: "Price must be a positive number."}),
  image: z.instanceof(File).optional(),
  categoryId: z.string().min(1, { message: "Please select a category."}),
});

const CategoryFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
});

async function uploadImage(image: File) {
  if (image.size === 0) {
    return null;
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = image.name.split('.').pop();
  const filename = `${randomUUID()}.${extension}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  const path = join(uploadDir, filename);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path, buffer);

  return `/uploads/${filename}`;
}

// Get all products, with optional AI-powered search
export async function getProducts(query?: string): Promise<Product[]> {
  if (query) {
    try {
      const allProducts = await prisma.product.findMany();
      const searchResults = await semanticProductSearch({
        query: query,
        products: allProducts.map(p => ({ name: p.name, description: p.description })),
      });
      
      const resultSet = new Set(searchResults.map(p => p.name));
      return allProducts.filter(p => resultSet.has(p.name));
    } catch (error) {
      console.error('AI search failed, falling back to basic search:', error);
      const lowerCaseQuery = query.toLowerCase();
      return prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: lowerCaseQuery } },
            { description: { contains: lowerCaseQuery } },
          ],
        },
      });
    }
  }
  return prisma.product.findMany();
}

export async function getProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

export async function createProduct(formData: FormData) {
  const validatedFields = ProductFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    throw new Error('Invalid product data.');
  }

  const { name, description, price, image, categoryId } = validatedFields.data;
  if (!image || image.size === 0) {
    throw new Error('Image is required.');
  }
  const imageUrl = await uploadImage(image);

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      imageUrl: imageUrl!,
      categoryId,
    },
  });

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

  const { name, description, price, image, categoryId } = validatedFields.data;

  let imageUrl: string | undefined = undefined;
  if (image && image.size > 0) {
    imageUrl = await uploadImage(image);
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      imageUrl: imageUrl || product.imageUrl,
      categoryId,
    },
  });

  revalidatePath('/');
  revalidatePath(`/products/${id}/edit`);
  redirect('/');
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/');
}

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany();
}

export async function createCategory(formData: FormData) {
  const validatedFields = CategoryFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    throw new Error('Invalid category data.');
  }

  const { name } = validatedFields.data;

  await prisma.category.create({
    data: {
      name,
    },
  });

  revalidatePath('/products/new');
}
