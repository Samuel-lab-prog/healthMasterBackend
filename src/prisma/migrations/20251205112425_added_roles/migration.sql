/*
  Warnings:

  - The `role` column on the `Doctor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Referral` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('pending', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "DoctorRole" AS ENUM ('doctor', 'admin');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user');

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "role",
ADD COLUMN     "role" "DoctorRole" NOT NULL DEFAULT 'doctor';

-- AlterTable
ALTER TABLE "Referral" DROP COLUMN "status",
ADD COLUMN     "status" "ReferralStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';

-- DropEnum
DROP TYPE "Role";
