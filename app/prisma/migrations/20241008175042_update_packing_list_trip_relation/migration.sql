-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_packingListId_fkey";

-- AlterTable
ALTER TABLE "Trip" ALTER COLUMN "packingListId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "PackingList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
