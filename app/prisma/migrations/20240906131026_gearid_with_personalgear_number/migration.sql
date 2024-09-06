/*
  Warnings:

  - The `gearId` column on the `PersonalGear` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PersonalGear" DROP COLUMN "gearId",
ADD COLUMN     "gearId" INTEGER;
