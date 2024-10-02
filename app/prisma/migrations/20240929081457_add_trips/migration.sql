-- DropForeignKey
ALTER TABLE "PackingList" DROP CONSTRAINT "PackingList_tripId_fkey";

-- CreateTable
CREATE TABLE "_PackingListToTrip" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PackingListToTrip_AB_unique" ON "_PackingListToTrip"("A", "B");

-- CreateIndex
CREATE INDEX "_PackingListToTrip_B_index" ON "_PackingListToTrip"("B");

-- AddForeignKey
ALTER TABLE "_PackingListToTrip" ADD CONSTRAINT "_PackingListToTrip_A_fkey" FOREIGN KEY ("A") REFERENCES "PackingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackingListToTrip" ADD CONSTRAINT "_PackingListToTrip_B_fkey" FOREIGN KEY ("B") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
