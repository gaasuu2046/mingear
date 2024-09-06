-- CreateTable
CREATE TABLE "PersonalGear" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "brand" TEXT,
    "img" TEXT,
    "price" INTEGER,
    "productUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalGear_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PersonalGear" ADD CONSTRAINT "PersonalGear_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
