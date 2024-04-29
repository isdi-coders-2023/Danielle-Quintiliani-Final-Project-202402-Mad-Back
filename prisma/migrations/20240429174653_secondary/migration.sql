/*
  Warnings:

  - You are about to drop the column `follow` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "follow",
ALTER COLUMN "birthday" SET DATA TYPE TEXT,
ALTER COLUMN "avatar" DROP NOT NULL;
