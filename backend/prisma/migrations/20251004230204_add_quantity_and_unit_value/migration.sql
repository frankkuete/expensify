-- AlterTable
ALTER TABLE "public"."Asset" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "unitValue" DECIMAL(18,2) NOT NULL DEFAULT 0;
