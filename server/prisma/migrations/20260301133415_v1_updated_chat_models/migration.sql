/*
  Warnings:

  - The values [directMessage] on the enum `chatType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `students_ids` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `teachers_ids` on the `courses` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "chatType_new" AS ENUM ('course', 'thread', 'announcement');
ALTER TABLE "chats" ALTER COLUMN "type" TYPE "chatType_new" USING ("type"::text::"chatType_new");
ALTER TYPE "chatType" RENAME TO "chatType_old";
ALTER TYPE "chatType_new" RENAME TO "chatType";
DROP TYPE "public"."chatType_old";
COMMIT;

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "students_ids",
DROP COLUMN "teachers_ids";
