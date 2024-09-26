-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'UNSPECIFIED');

-- AlterTable
ALTER TABLE "PackingList" ADD COLUMN     "season" "Season" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "area" TEXT;
