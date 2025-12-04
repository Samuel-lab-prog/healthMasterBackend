import { prisma } from '../../prisma/client.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import * as types from './types.ts';

export async function insertDoctor(
  doctorData: types.InsertDoctor
): Promise<Pick<types.DoctorRow, 'id'>> {
  return withPrismaErrorHandling(() =>
    prisma.doctor.create({
      data: doctorData,
      select: { id: true },
    })
  );
}

export async function selectAllDoctors(): Promise<types.DoctorRow[]> {
  return withPrismaErrorHandling(() => prisma.doctor.findMany());
}

export async function selectDoctorByField<K extends types.UniqueDoctorField>(
  field: K,
  value: types.DoctorRow[K]
): Promise<types.DoctorRow | null> {
  return withPrismaErrorHandling(() =>
    prisma.doctor.findFirst({
      where: { [field]: value },
    })
  );
}
