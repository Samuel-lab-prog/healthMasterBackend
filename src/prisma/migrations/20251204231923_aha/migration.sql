/*
  Warnings:

  - The `updatedAt` column on the `Consultation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updatedAt` column on the `Doctor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updatedAt` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `birthDate` on the `Doctor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `reason` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referredById` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referredToId` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `birthDate` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Consultation" ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "birthDate",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Referral" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "reason" TEXT NOT NULL,
ADD COLUMN     "referredById" INTEGER NOT NULL,
ADD COLUMN     "referredToId" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL,
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "birthDate",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredToId_fkey" FOREIGN KEY ("referredToId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
