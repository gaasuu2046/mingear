-- -- CreateTable
-- CREATE TABLE "PackingListItem" (
--     "id" SERIAL NOT NULL,
--     "packingListId" INTEGER NOT NULL,
--     "gearId" INTEGER,
--     "personalGearId" INTEGER,
--     "quantity" INTEGER NOT NULL DEFAULT 1,

--     CONSTRAINT "PackingListItem_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "Trip" (
--     "id" SERIAL NOT NULL,
--     "name" TEXT NOT NULL,
--     "ptid" TEXT,
--     "elevation" INTEGER,
--     "lat" DOUBLE PRECISION,
--     "lon" DOUBLE PRECISION,
--     "userId" TEXT NOT NULL,

--     CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "PackingListLike" (
--     "id" SERIAL NOT NULL,
--     "userId" TEXT NOT NULL,
--     "packingListId" INTEGER NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

--     CONSTRAINT "PackingListLike_pkey" PRIMARY KEY ("id")
-- );

-- -- AlterTable
-- ALTER TABLE "PackingList" 
-- DROP CONSTRAINT IF EXISTS "PackingList_gearId_fkey",
-- DROP CONSTRAINT IF EXISTS "PackingList_personalGearId_fkey",
-- DROP COLUMN IF EXISTS "gearId",
-- DROP COLUMN IF EXISTS "personalGearId",
-- ADD COLUMN "name" TEXT NOT NULL DEFAULT '',
-- ADD COLUMN "tripId" INTEGER,
-- ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- -- CreateIndex
-- CREATE UNIQUE INDEX "PackingListLike_userId_packingListId_key" ON "PackingListLike"("userId", "packingListId");

-- -- AddForeignKey
-- ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "PackingListItem" ADD CONSTRAINT "PackingListItem_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "PackingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "PackingListItem" ADD CONSTRAINT "PackingListItem_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "Gear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "PackingListItem" ADD CONSTRAINT "PackingListItem_personalGearId_fkey" FOREIGN KEY ("personalGearId") REFERENCES "PersonalGear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "PackingListLike" ADD CONSTRAINT "PackingListLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "PackingListLike" ADD CONSTRAINT "PackingListLike_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "PackingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE IF NOT EXISTS "PackingListItem" (
    "id" SERIAL NOT NULL,
    "packingListId" INTEGER NOT NULL,
    "gearId" INTEGER,
    "personalGearId" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "PackingListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PackingListLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "packingListId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PackingListLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Trip" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ptid" TEXT,
    "elevation" INTEGER,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "PackingList" 
DROP CONSTRAINT IF EXISTS "PackingList_gearId_fkey",
DROP CONSTRAINT IF EXISTS "PackingList_personalGearId_fkey",
DROP CONSTRAINT IF EXISTS "PackingList_userId_gearId_personalGearId_key",
DROP COLUMN IF EXISTS "personalGearId",
ADD COLUMN IF NOT EXISTS "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "tripId" INTEGER,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PackingListLike_userId_packingListId_key" ON "PackingListLike"("userId", "packingListId");

-- AddForeignKey
ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingListItem" ADD CONSTRAINT "PackingListItem_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "PackingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingListItem" ADD CONSTRAINT "PackingListItem_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "Gear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingListItem" ADD CONSTRAINT "PackingListItem_personalGearId_fkey" FOREIGN KEY ("personalGearId") REFERENCES "PersonalGear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingListLike" ADD CONSTRAINT "PackingListLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingListLike" ADD CONSTRAINT "PackingListLike_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "PackingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PackingList" ADD COLUMN IF NOT EXISTS "gearId" INTEGER;
