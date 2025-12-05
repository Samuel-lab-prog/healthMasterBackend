/*
  Warnings:

  - Added the required column `endTime` to the `Consultation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Consultation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Consultation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "ConsultationType" AS ENUM ('return_visit', 'exam', 'routine', 'checkup');

-- AlterTable
ALTER TABLE "Consultation" ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "status" "ConsultationStatus" NOT NULL DEFAULT 'scheduled',
ADD COLUMN     "type" "ConsultationType" NOT NULL;

-- CreateIndex
CREATE INDEX "Consultation_userId_idx" ON "Consultation"("userId");

-- CreateIndex
CREATE INDEX "Consultation_doctorId_idx" ON "Consultation"("doctorId");

-- CreateIndex
CREATE INDEX "Consultation_date_idx" ON "Consultation"("date");
