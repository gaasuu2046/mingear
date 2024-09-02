/*
  Warnings:

  - You are about to drop the column `brand` on the `Gear` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Gear` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Gear" DROP CONSTRAINT "Gear_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Gear" DROP CONSTRAINT "Gear_categoryId_fkey";

-- AlterTable
ALTER TABLE "Gear" DROP COLUMN "brand",
DROP COLUMN "category";

-- AddForeignKey
ALTER TABLE "Gear" ADD CONSTRAINT "Gear_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gear" ADD CONSTRAINT "Gear_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
