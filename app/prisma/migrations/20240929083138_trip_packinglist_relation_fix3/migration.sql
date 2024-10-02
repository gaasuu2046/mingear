/*
  Warnings:

  - You are about to drop the column `tripId` on the `PackingList` table. All the data in the column will be lost.
  - You are about to drop the `_PackingListToTrip` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `packingListId` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PackingListToTrip" DROP CONSTRAINT "_PackingListToTrip_A_fkey";

-- DropForeignKey
ALTER TABLE "_PackingListToTrip" DROP CONSTRAINT "_PackingListToTrip_B_fkey";

-- AlterTable
ALTER TABLE "PackingList" DROP COLUMN "tripId";

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "packingListId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PackingListToTrip";

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "PackingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
