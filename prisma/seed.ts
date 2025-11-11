import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'Printing' },
      { name: 'Design' },
      { name: 'Marketing' },
      { name: 'Signs & Banners' },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
