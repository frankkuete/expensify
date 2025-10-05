-- AlterTable
ALTER TABLE "public"."Asset" ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(18,2);
