import fs from 'fs';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function exportData() {
  const models = ['Account'];
  
  for (const model of models) {
    const data = await prisma[model.toLowerCase()].findMany();
    fs.writeFileSync(`${model.toLowerCase()}.json`, JSON.stringify(data, null, 2));
  }

  console.log('Data export completed');
}

exportData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });