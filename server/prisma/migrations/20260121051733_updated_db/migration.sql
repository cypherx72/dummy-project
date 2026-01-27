/*
  Warnings:

  - You are about to drop the column `last_read_at` on the `chatMembers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chatMembers" DROP COLUMN "last_read_at",
ADD COLUMN     "unread_message_count" INTEGER NOT NULL DEFAULT 0;
