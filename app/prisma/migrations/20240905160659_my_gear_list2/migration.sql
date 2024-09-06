/*
  Warnings:

  - You are about to drop the column `brand` on the `PersonalGear` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PersonalGear" DROP COLUMN "brand",
ADD COLUMN     "brandId" INTEGER;

-- AddForeignKey
ALTER TABLE "PersonalGear" ADD CONSTRAINT "PersonalGear_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
