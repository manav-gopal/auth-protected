import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  // Read categories data from JSON file
  const categoriesData = JSON.parse(fs.readFileSync('./seed/categories.json', 'utf-8'));

  // Insert categories data into the database
  for (const category of categoriesData) {
    await prisma.categories.create({
      data: category,
    });
  }

  console.log('Categories data seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  });
