/*
  Warnings:

  - You are about to drop the column `count` on the `reactions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "reactions_chat_member_id_key";

-- DropIndex
DROP INDEX "reactions_emoji_key";

-- AlterTable
ALTER TABLE "reactions" DROP COLUMN "count";
