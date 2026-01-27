/*
  Warnings:

  - You are about to drop the column `course_id` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `chat_id` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `messages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[media_id]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'pdf', 'text');

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_course_id_fkey";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_fkey";

-- DropIndex
DROP INDEX "chats_course_id_key";

-- DropIndex
DROP INDEX "files_chat_id_key";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "course_id",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "chat_id";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "type",
ADD COLUMN     "delivered_at" TIMESTAMP(3),
ADD COLUMN     "media_id" TEXT,
ADD COLUMN     "read_at" TIMESTAMP(3),
ALTER COLUMN "content" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "messages_media_id_key" ON "messages"("media_id");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_code_fkey" FOREIGN KEY ("code") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
