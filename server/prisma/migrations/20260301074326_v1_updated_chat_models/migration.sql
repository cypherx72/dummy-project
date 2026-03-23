/*
  Warnings:

  - You are about to drop the column `role` on the `ChatMember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId]` on the table `ChatMember` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ChatMember" DROP COLUMN "role";

-- CreateIndex
CREATE UNIQUE INDEX "ChatMember_senderId_key" ON "ChatMember"("senderId");
