-- AlterTable
ALTER TABLE "public"."Asset" ADD COLUMN     "address" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "surface" DOUBLE PRECISION,
ADD COLUMN     "yearBuilt" INTEGER;
