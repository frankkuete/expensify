/*
  Warnings:

  - You are about to drop the column `realEstateId` on the `AssetDocument` table. All the data in the column will be lost.
  - You are about to drop the column `stockId` on the `AssetDocument` table. All the data in the column will be lost.
  - Added the required column `objectId` to the `AssetDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectType` to the `AssetDocument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AssetDocument" DROP CONSTRAINT "AssetDocument_realEstateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AssetDocument" DROP CONSTRAINT "AssetDocument_stockId_fkey";

-- AlterTable
ALTER TABLE "public"."AssetDocument" DROP COLUMN "realEstateId",
DROP COLUMN "stockId",
ADD COLUMN     "objectId" UUID NOT NULL,
ADD COLUMN     "objectType" "public"."AssetType" NOT NULL;
