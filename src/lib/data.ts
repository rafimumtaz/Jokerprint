import type { Product } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): string => {
    const image = PlaceHolderImages.find(img => img.id === id);
    return image ? image.imageUrl : PlaceHolderImages.find(img => img.id === 'default')?.imageUrl || '';
};

export let products: Product[] = [
  {
    id: '1',
    name: 'Black & White Photocopy',
    description: 'High-speed black and white photocopying service. Perfect for documents, reports, and manuals. Various paper sizes available, from A5 to A3.',
    price: 0.10,
    tags: ['copying', 'documents', 'monochrome'],
    images: [getImage('photocopier')],
  },
  {
    id: '2',
    name: 'Color Printing',
    description: 'Vibrant and high-quality color printing for flyers, brochures, and presentations. Glossy and matte finishes available on premium paper stock.',
    price: 0.50,
    tags: ['printing', 'marketing', 'color'],
    images: [getImage('color-printing')],
  },
  {
    id: '3',
    name: 'Lamination Service',
    description: 'Protect your important documents with our professional lamination service. Available for sizes up to A3. Ideal for certificates and posters.',
    price: 2.00,
    tags: ['finishing', 'protection', 'documents'],
    images: [getImage('lamination-machine')],
  },
  {
    id: '4',
    name: 'Spiral Binding',
    description: 'Get your reports and presentations professionally bound with our spiral binding service. A variety of cover and spiral colors to choose from.',
    price: 5.00,
    tags: ['binding', 'reports', 'presentations'],
    images: [getImage('book-binding')],
  },
  {
    id: '5',
    name: 'Passport Photos',
    description: 'Instant passport and ID photos that meet official requirements. Our service ensures your photos will be accepted. Digital copies also available.',
    price: 15.00,
    tags: ['photo', 'id', 'official'],
    images: [getImage('passport-photo')],
  },
  {
    id: '6',
    name: 'Stationery Supplies',
    description: 'A wide range of office and school stationery, including high-quality pens, various types of notebooks, durable folders, and more.',
    price: 1.00,
    tags: ['supplies', 'office', 'school'],
    images: [getImage('office-supplies')],
  },
];
