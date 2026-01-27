/*
  Warnings:

  - A unique constraint covering the columns `[chat_id,user_id]` on the table `chatMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "chatMembers_chat_id_user_id_key" ON "chatMembers"("chat_id", "user_id");
