/*
  Warnings:

  - The `role` column on the `doctors` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('doctor', 'admin');

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'doctor';
