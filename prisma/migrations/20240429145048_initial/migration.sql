-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'CLUB');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "follow" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "iscriptionAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "ownerItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_ownerItemId_fkey" FOREIGN KEY ("ownerItemId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
