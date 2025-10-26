-- AlterTable
ALTER TABLE "public"."RealEstate" ALTER COLUMN "yearBuilt" DROP NOT NULL,
ALTER COLUMN "hasParking" DROP NOT NULL,
ALTER COLUMN "hasGarden" DROP NOT NULL;
