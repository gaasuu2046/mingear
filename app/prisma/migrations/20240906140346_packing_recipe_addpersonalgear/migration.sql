/*
  Warnings:

  - You are about to drop the column `gearId` on the `PersonalGear` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,gearId,personalGearId]` on the table `PackingList` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PackingList" DROP CONSTRAINT "PackingList_gearId_fkey";

-- AlterTable
ALTER TABLE "PackingList" ADD COLUMN     "personalGearId" INTEGER,
ALTER COLUMN "gearId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PersonalGear" DROP COLUMN "gearId";

-- CreateIndex
CREATE UNIQUE INDEX "PackingList_userId_gearId_personalGearId_key" ON "PackingList"("userId", "gearId", "personalGearId");

-- AddForeignKey
ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "Gear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_personalGearId_fkey" FOREIGN KEY ("personalGearId") REFERENCES "PersonalGear"("id") ON DELETE SET NULL ON UPDATE CASCADE;
