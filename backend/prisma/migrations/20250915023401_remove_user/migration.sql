/*
  Warnings:

  - You are about to drop the column `userId` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clerkId` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Asset" DROP CONSTRAINT "Asset_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Asset" DROP COLUMN "userId",
ADD COLUMN     "clerkId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."User";
