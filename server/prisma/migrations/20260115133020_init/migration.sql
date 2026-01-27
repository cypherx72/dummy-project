-- DropIndex
DROP INDEX "reactions_message_id_key";

-- AlterTable
ALTER TABLE "reactions" ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 1;
