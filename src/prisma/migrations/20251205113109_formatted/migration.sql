/*
  Warnings:

  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Consultation_date_idx";

-- DropIndex
DROP INDEX "Consultation_doctorId_idx";

-- DropIndex
DROP INDEX "Consultation_userId_idx";

-- AlterTable
ALTER TABLE "Consultation" ALTER COLUMN "type" SET DEFAULT 'routine';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;
