import { prisma } from '../../prisma/client.ts';
import type { Prisma } from '../../generated/client.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import type { DoctorCreateInput } from '../../generated/models';

type DoctorRow = Prisma.DoctorGetPayload<object>;

export async function insertDoctor(
  doctorData: DoctorCreateInput
): Promise<Pick<DoctorRow, 'id'> | null> {
  return (
    withPrismaErrorHandling<Pick<DoctorRow, 'id'>>(() =>
      prisma.doctor.create({
        data: doctorData,
        select: { id: true },
      })
    ) ?? null
  );
}

export async function selectAllDoctors(): Promise<DoctorRow[]> {
  return (await withPrismaErrorHandling<DoctorRow[]>(() => prisma.doctor.findMany())) || [];
}
type UniqueDoctorField = 'id' | 'email' | 'crm' | 'cpf' | 'phoneNumber';

export async function selectDoctorByField(
  field: UniqueDoctorField,
  value: string | number
): Promise<DoctorRow | null> {
  return withPrismaErrorHandling<DoctorRow>(() => prisma.doctor.$selectByField(field, value));
}
