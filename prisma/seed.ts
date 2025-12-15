import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean up existing data to avoid duplicates/conflicts during re-seeding
  // Note: In production/real dev, be careful with deleteMany.
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})

  const categories = [
    {
      name: 'Cetak Warna',
      products: [
        { name: 'Artpaper 120', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Artpaper 210', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Artpaper 260', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'HVS A3', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'HVS F4 / A4', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Sticker Bontac', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Sticker Glossy Camel 160', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Cetak A3 / A4 / F4 (warna)', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
      ]
    },
    {
      name: 'Cetak Monochrome',
      products: [
        { name: 'HVS A3', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Bufallo F4', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'HVS F4 / A4', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Cetak A3 / A4 / F4 (BW)', description: 'Sticker Kisscut / Diecut Autocut, Laminasi, Masking Tape', price: 0, imageUrl: '/uploads/placeholder.jpg' },
      ]
    },
    {
      name: 'Cetak Besar',
      products: [
        { name: 'Banner', description: 'Large format printing', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'X Banner / Y Banner', description: 'Large format printing', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Roll Up Banner', description: 'Large format printing', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'One Way Sticker', description: 'Large format printing', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Sticker Ritrama', description: 'Large format printing', price: 0, imageUrl: '/uploads/placeholder.jpg' },
      ]
    },
    {
      name: 'Jasa Desain & Dokumen',
      products: [
        { name: 'Desain (Graphic Design)', description: 'Professional design services', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Scanning', description: 'Document scanning services', price: 0, imageUrl: '/uploads/placeholder.jpg' },
      ]
    },
    {
      name: 'Jilid (Binding)',
      products: [
        { name: 'Jilid Biasa', description: 'Standard binding', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Jilid Buku (Cover Artpaper)', description: 'Book binding with Artpaper cover', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Jilid Spiral', description: 'Spiral binding', price: 0, imageUrl: '/uploads/placeholder.jpg' },
      ]
    },
    {
      name: 'Cutting & Finishing',
      products: [
        { name: 'Cutting Autocontour', description: 'Precision cutting', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Laminasi (umum)', description: 'Lamination services', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Mass Cutting', description: 'Bulk cutting services', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Sambung Banner', description: 'Banner joining', price: 0, imageUrl: '/uploads/placeholder.jpg' },
      ]
    },
    {
      name: 'Special Offer',
      products: [
        { name: 'Cetak Kartu Nama (AP 210) – 1 sisi', description: 'Business cards', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Kalender', description: 'Custom calendars', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Sertifikat', description: 'Certificates', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Brosur', description: 'Brochures', price: 0, imageUrl: '/uploads/placeholder.jpg' },
        { name: 'Flyer', description: 'Flyers', price: 0, imageUrl: '/uploads/placeholder.jpg' },
      ]
    },
  ]

  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
      },
    })

    for (const prod of cat.products) {
      await prisma.product.create({
        data: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          imageUrl: prod.imageUrl,
          categoryId: category.id,
          status: 'available', // Default status
        },
      })
    }
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
