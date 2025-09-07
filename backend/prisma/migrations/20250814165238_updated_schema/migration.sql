-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "public"."AssetType" AS ENUM ('real_estate', 'stock', 'bond', 'etf', 'cash', 'custom');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('income', 'expense');

-- DropForeignKey
ALTER TABLE "public"."Asset" DROP CONSTRAINT "Asset_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Budget" DROP CONSTRAINT "Budget_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Income" DROP CONSTRAINT "Income_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Asset" DROP CONSTRAINT "Asset_pkey",
DROP COLUMN "category",
DROP COLUMN "purchaseDate",
ADD COLUMN     "categoryId" UUID NOT NULL,
ADD COLUMN     "currency" VARCHAR(10) NOT NULL DEFAULT 'USD',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "subcategoryId" UUID,
ADD COLUMN     "type" "public"."AssetType" NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "value" SET DATA TYPE DECIMAL(18,2),
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "Asset_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."Budget";

-- DropTable
DROP TABLE "public"."Expense";

-- DropTable
DROP TABLE "public"."Income";

-- CreateTable
CREATE TABLE "public"."AssetCategory" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "AssetCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssetSubcategory" (
    "id" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "AssetSubcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ManualAssetUpdate" (
    "id" UUID NOT NULL,
    "assetId" UUID NOT NULL,
    "updatedValue" DECIMAL(18,2) NOT NULL,
    "updateDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "ManualAssetUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "categoryId" UUID NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "transactionDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TransactionCategory" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "TransactionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetCategory_name_key" ON "public"."AssetCategory"("name");

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."AssetCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "public"."AssetSubcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssetSubcategory" ADD CONSTRAINT "AssetSubcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."AssetCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ManualAssetUpdate" ADD CONSTRAINT "ManualAssetUpdate_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."TransactionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
