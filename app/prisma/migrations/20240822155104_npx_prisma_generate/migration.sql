/*
  Warnings:

  - Made the column `img` on table `Gear` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Gear" ALTER COLUMN "img" SET NOT NULL;
