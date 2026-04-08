/*
  Warnings:

  - You are about to drop the column `createdAt` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `maxScore` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `assignments` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxMarks` to the `assignments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('graded', 'submitted', 'pending', 'missed', 'late');

-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_createdBy_fkey";

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "maxScore",
DROP COLUMN "status",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "maxMarks" INTEGER NOT NULL,
ADD COLUMN     "postedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "submissionId" TEXT;

-- DropEnum
DROP TYPE "AssignmentStatus";

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "submittedText" TEXT,
    "marksObtained" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'pending',
    "assignmentId" TEXT NOT NULL,
    "submittedById" TEXT NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
