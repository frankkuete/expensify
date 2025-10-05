/*
  Warnings:

  - You are about to drop the `ManualAssetUpdate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Asset" DROP CONSTRAINT "Asset_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ManualAssetUpdate" DROP CONSTRAINT "ManualAssetUpdate_assetId_fkey";

-- AlterTable
ALTER TABLE "public"."Asset" ALTER COLUMN "categoryId" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."ManualAssetUpdate";

-- CreateTable
CREATE TABLE "public"."AssetDocument" (
    "id" UUID NOT NULL,
    "assetId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."AssetCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssetDocument" ADD CONSTRAINT "AssetDocument_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
