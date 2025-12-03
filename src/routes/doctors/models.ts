import { prisma } from '../../prisma/client.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import type { UniqueDoctorField, InsertDoctor, DoctorRow } from './types.ts';

export async function insertDoctor(
  doctorData: InsertDoctor
): Promise<Pick<DoctorRow, 'id'>> {
  return withPrismaErrorHandling(() =>
    prisma.doctor.create({
      data: doctorData,
      select: { id: true },
    })
  );
}

export async function selectAllDoctors(): Promise<DoctorRow[]> {
  return withPrismaErrorHandling(() => prisma.doctor.findMany());
}

export async function selectDoctorByField<K extends UniqueDoctorField>(
  field: K,
  value: DoctorRow[K]
): Promise<DoctorRow | null> {
  return withPrismaErrorHandling(() =>
    prisma.doctor.findFirst({
      where: { [field]: value },
    })
  );
}
