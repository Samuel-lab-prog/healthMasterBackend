/*
  Warnings:

  - Made the column `notes` on table `Referral` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Referral" ALTER COLUMN "notes" SET NOT NULL;
