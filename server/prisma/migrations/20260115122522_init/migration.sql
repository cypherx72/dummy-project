/*
  Warnings:

  - You are about to drop the column `user_id` on the `reactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chat_member_id]` on the table `reactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chat_member_id` to the `reactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reactions" DROP CONSTRAINT "reactions_user_id_fkey";

-- DropIndex
DROP INDEX "reactions_user_id_key";

-- AlterTable
ALTER TABLE "reactions" DROP COLUMN "user_id",
ADD COLUMN     "chat_member_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reactions_chat_member_id_key" ON "reactions"("chat_member_id");

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_chat_member_id_fkey" FOREIGN KEY ("chat_member_id") REFERENCES "chatMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
