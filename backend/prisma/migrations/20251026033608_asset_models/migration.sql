/*
  Warnings:

  - You are about to drop the column `categoryId` on the `RealEstate` table. All the data in the column will be lost.
  - You are about to drop the column `subcategoryId` on the `RealEstate` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `subcategoryId` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `TransactionCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."RealEstate" DROP COLUMN "categoryId",
DROP COLUMN "subcategoryId";

-- AlterTable
ALTER TABLE "public"."Stock" DROP COLUMN "categoryId",
DROP COLUMN "subcategoryId";

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "categoryId";

-- DropTable
DROP TABLE "public"."TransactionCategory";
