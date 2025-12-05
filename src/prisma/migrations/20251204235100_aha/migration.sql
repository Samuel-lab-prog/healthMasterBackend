/*
  Warnings:

  - Made the column `updatedAt` on table `Consultation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Doctor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Consultation" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Doctor" ALTER COLUMN "updatedAt" SET NOT NULL;
