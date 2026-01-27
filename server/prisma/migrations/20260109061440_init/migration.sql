/*
  Warnings:

  - A unique constraint covering the columns `[course_id]` on the table `chats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_code_fkey";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "course_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "chats_course_id_key" ON "chats"("course_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
