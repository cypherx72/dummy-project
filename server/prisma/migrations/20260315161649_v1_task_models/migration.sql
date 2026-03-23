/*
  Warnings:

  - Added the required column `maxScore` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionType` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `assignments` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('draft', 'published', 'closed');

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('fileUpload', 'textEntry', 'websiteUrl');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('high', 'medium', 'low');

-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "allowLateSubmission" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "maxScore" INTEGER NOT NULL,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'low',
ADD COLUMN     "status" "AssignmentStatus" NOT NULL,
ADD COLUMN     "submissionType" "SubmissionType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "assignmentId" TEXT;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
