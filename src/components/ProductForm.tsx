'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TagInput } from '@/components/TagInput';
import type { Product } from '@/lib/types';
import { Loader2, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const productFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag.'),
  images: z.array(z.string().url('Each image must be a valid URL.')).min(1, 'Please add at least one image URL.'),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

type ProductFormProps = {
  product?: Product;
  action: (formData: FormData) => Promise<void>;
  submitButtonText: string;
};

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {text}
    </Button>
  );
}

export function ProductForm({ product, action, submitButtonText }: ProductFormProps) {
  const router = useRouter();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? { ...product }
      : {
          name: '',
          description: '',
          price: 0,
          tags: [],
          images: [],
        },
  });

  const formAction = async (formData: FormData) => {
    try {
      await action(formData);
      toast({
        title: 'Success!',
        description: `Product has been ${product ? 'updated' : 'created'}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        action={formAction}
        className="space-y-8"
        onSubmit={form.handleSubmit(() => {
          const values = form.getValues();
          const formData = new FormData();
          formData.append('name', values.name);
          formData.append('description', values.description);
          formData.append('price', String(values.price));
          formData.append('tags', values.tags.join(','));
          formData.append('images', values.images.join(','));
          formAction(formData);
        })}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Color Printing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the product in detail..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="9.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <TagInput placeholder="Add a tag..." {...field} />
                      </FormControl>
                      <FormDescription>Press Enter to add a new tag.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URLs</FormLabel>
                        <div className="space-y-2">
                          {field.value.map((url, index) => (
                            <div key={index} className="flex items-center gap-2">
                               <Input
                                value={url}
                                onChange={(e) => {
                                    const newImages = [...field.value];
                                    newImages[index] = e.target.value;
                                    field.onChange(newImages);
                                }}
                                placeholder="https://example.com/image.png"
                               />
                               <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
                               >
                                  <Trash className="h-4 w-4" />
                               </Button>
                            </div>
                          ))}
                          <Button
                           type="button"
                           variant="outline"
                           onClick={() => field.onChange([...field.value, ''])}
                          >
                            Add Image URL
                          </Button>
                        </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <SubmitButton text={submitButtonText} />
        </div>
      </form>
    </Form>
  );
}
