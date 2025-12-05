-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "sex" "Sex" NOT NULL DEFAULT 'other';

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
