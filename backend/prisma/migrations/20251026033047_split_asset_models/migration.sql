/*
  Warnings:

  - You are about to drop the column `assetId` on the `AssetDocument` table. All the data in the column will be lost.
  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssetCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssetSubcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'OTHER');

-- DropForeignKey
ALTER TABLE "public"."Asset" DROP CONSTRAINT "Asset_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Asset" DROP CONSTRAINT "Asset_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AssetDocument" DROP CONSTRAINT "AssetDocument_assetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AssetSubcategory" DROP CONSTRAINT "AssetSubcategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."AssetDocument" DROP COLUMN "assetId",
ADD COLUMN     "realEstateId" UUID,
ADD COLUMN     "stockId" UUID;

-- DropTable
DROP TABLE "public"."Asset";

-- DropTable
DROP TABLE "public"."AssetCategory";

-- DropTable
DROP TABLE "public"."AssetSubcategory";

-- CreateTable
CREATE TABLE "public"."RealEstate" (
    "id" UUID NOT NULL,
    "clerkId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "value" DECIMAL(18,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'USD',
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "surface" DOUBLE PRECISION NOT NULL,
    "yearBuilt" INTEGER NOT NULL,
    "propertyType" "public"."PropertyType" NOT NULL DEFAULT 'HOUSE',
    "rooms" INTEGER,
    "bathrooms" INTEGER,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "hasGarden" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" UUID,
    "subcategoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RealEstate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Stock" (
    "id" UUID NOT NULL,
    "clerkId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "value" DECIMAL(18,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'USD',
    "ticker" TEXT NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,
    "purchasePrice" DECIMAL(18,2) NOT NULL,
    "exchange" TEXT,
    "categoryId" UUID,
    "subcategoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AssetDocument" ADD CONSTRAINT "AssetDocument_realEstateId_fkey" FOREIGN KEY ("realEstateId") REFERENCES "public"."RealEstate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssetDocument" ADD CONSTRAINT "AssetDocument_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "public"."Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
