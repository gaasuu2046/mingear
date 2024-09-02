-- CreateTable
CREATE TABLE "Category" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Brand" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL
);

-- AlterTable
ALTER TABLE "Gear" ADD COLUMN "brandId" INTEGER,
                   ADD COLUMN "categoryId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- AddForeignKey
ALTER TABLE "Gear" ADD CONSTRAINT "Gear_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gear" ADD CONSTRAINT "Gear_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Populate Category and Brand tables
INSERT INTO "Category" (name)
SELECT DISTINCT category FROM "Gear"
WHERE category IS NOT NULL;

INSERT INTO "Brand" (name)
SELECT DISTINCT brand FROM "Gear"
WHERE brand IS NOT NULL;

-- Update Gear table with new foreign keys
UPDATE "Gear" g
SET "categoryId" = c.id
FROM "Category" c
WHERE g.category = c.name;

UPDATE "Gear" g
SET "brandId" = b.id
FROM "Brand" b
WHERE g.brand = b.name;

-- Make brandId and categoryId NOT NULL after populating data
ALTER TABLE "Gear" ALTER COLUMN "brandId" SET NOT NULL,
                   ALTER COLUMN "categoryId" SET NOT NULL;

-- Optionally, you can drop the old columns if you don't need them anymore
-- ALTER TABLE "Gear" DROP COLUMN "category",
--                    DROP COLUMN "brand";
