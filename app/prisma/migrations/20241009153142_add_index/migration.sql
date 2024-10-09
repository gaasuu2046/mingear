-- CreateIndex
CREATE INDEX "CacheEntry_expiresAt_idx" ON "CacheEntry"("expiresAt");

-- CreateIndex
CREATE INDEX "Gear_brandId_idx" ON "Gear"("brandId");

-- CreateIndex
CREATE INDEX "Gear_categoryId_idx" ON "Gear"("categoryId");

-- CreateIndex
CREATE INDEX "PackingList_userId_createdAt_idx" ON "PackingList"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PackingList_season_idx" ON "PackingList"("season");

-- CreateIndex
CREATE INDEX "PackingListItem_packingListId_idx" ON "PackingListItem"("packingListId");

-- CreateIndex
CREATE INDEX "PackingListItem_gearId_idx" ON "PackingListItem"("gearId");

-- CreateIndex
CREATE INDEX "PackingListItem_personalGearId_idx" ON "PackingListItem"("personalGearId");

-- CreateIndex
CREATE INDEX "PackingListLike_userId_idx" ON "PackingListLike"("userId");

-- CreateIndex
CREATE INDEX "PackingListLike_packingListId_idx" ON "PackingListLike"("packingListId");

-- CreateIndex
CREATE INDEX "PersonalGear_userId_categoryId_idx" ON "PersonalGear"("userId", "categoryId");

-- CreateIndex
CREATE INDEX "PersonalGear_brandId_idx" ON "PersonalGear"("brandId");

-- CreateIndex
CREATE INDEX "Review_gearId_createdAt_idx" ON "Review"("gearId", "createdAt");

-- CreateIndex
CREATE INDEX "Trip_userId_startDate_idx" ON "Trip"("userId", "startDate");

-- CreateIndex
CREATE INDEX "Trip_packingListId_idx" ON "Trip"("packingListId");
