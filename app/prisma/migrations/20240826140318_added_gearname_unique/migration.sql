/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Gear` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Gear_name_key" ON "Gear"("name");
