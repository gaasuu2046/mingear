import fs from 'fs/promises';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importData() {
  const models = [
    'Brand', 'Category', 'Gear', 'Review', 'User'
  ];

  for (const model of models) {
    try {
      const data = JSON.parse(await fs.readFile(`${model.toLowerCase()}.json`, 'utf8'));
      console.log(`Importing ${model}...`);

      for (const item of data) {
        await prisma[model.toLowerCase()].create({
          data: {
            ...item,
            // 日付型のフィールドを適切に変換
            ...(item.createdAt && { createdAt: new Date(item.createdAt) }),
            ...(item.updatedAt && { updatedAt: new Date(item.updatedAt) }),
            ...(item.expires && { expires: new Date(item.expires) }),
            ...(item.emailVerified && { emailVerified: new Date(item.emailVerified) }),
            ...(item.expiresAt && { expiresAt: new Date(item.expiresAt) }),
          },
        });
      }

      console.log(`${model} import completed.`);
    } catch (error) {
      console.error(`Error importing ${model}:`, error);
    }
  }
}

async function main() {
  try {
    await prisma.$connect();
    await importData();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
