-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('male', 'female', 'other');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sex" "Sex" NOT NULL DEFAULT 'other';
