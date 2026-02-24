/*
  Warnings:

  - The values [EMAIL_VERIFY] on the enum `TokenType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TokenType_new" AS ENUM ('ACTIVATION', 'PASSWORD_RESET', 'EMAIL_VERIFICATION');
ALTER TABLE "tokens" ALTER COLUMN "type" TYPE "TokenType_new" USING ("type"::text::"TokenType_new");
ALTER TYPE "TokenType" RENAME TO "TokenType_old";
ALTER TYPE "TokenType_new" RENAME TO "TokenType";
DROP TYPE "public"."TokenType_old";
COMMIT;

-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "token" DROP NOT NULL;
