-- CreateEnum
CREATE TYPE "Category" AS ENUM ('CLOTHES', 'MOTO', 'SPAREPARTS', 'OTHER');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'OTHER';
