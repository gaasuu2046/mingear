const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function restoreData() {
  // バックアップからデータを読み込む（ここでは例としてJSONファイルを使用）
  const backupData = require('./backup.json');

  // PersonalGearの復元
  for (const gear of backupData.personalGears) {
    await prisma.personalGear.create({
      data: {
        userId: gear.userId,
        name: gear.name,
        weight: gear.weight,
        categoryId: gear.categoryId,
        img: gear.img,
        price: gear.price,
        productUrl: gear.productUrl,
        brandId: gear.brandId,
        gearId: gear.gearId,
      },
    });
  }

  // PackingListの復元
  for (const list of backupData.packingLists) {
    const newList = await prisma.packingList.create({
      data: {
        userId: list.userId,
        name: list.name,
        tripId: list.tripId,
      },
    });

    // PackingListItemの復元
    for (const item of list.items) {
      await prisma.packingListItem.create({
        data: {
          packingListId: newList.id,
          gearId: item.gearId,
          personalGearId: item.personalGearId,
          quantity: item.quantity,
        },
      });
    }
  }

  console.log('Data restoration completed.');
}

restoreData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  