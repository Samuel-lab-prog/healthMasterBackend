import { prisma } from '../../prisma/client.ts';
import type { ConsultationUncheckedCreateInput } from '../../generated/models.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import type { ConsultationRow, UserConsultationRow, DoctorConsultationRow } from './types.ts';

export async function insertConsultation(
  data: ConsultationUncheckedCreateInput
): Promise<Pick<ConsultationRow, 'id'> | null> {
  return withPrismaErrorHandling(async () => {
    return (
      (await prisma.consultation.create({
        data: {
          userId: data.userId,
          doctorId: data.doctorId,
          date: data.date,
          notes: data.notes,
        },
        select: { id: true },
      })) ?? null
    );
  });
}

export async function selectConsultationById(
  consultationId: number
): Promise<ConsultationRow | null> {
  return (
    withPrismaErrorHandling<ConsultationRow | null>(() =>
      prisma.consultation.findUnique({
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
          doctor: {
            select: { firstName: true, lastName: true },
          },
        },
        where: { id: consultationId },
      })
    ) ?? null
  );
}

export async function selectUserConsultations(userId: number): Promise<UserConsultationRow[]> {
  return await withPrismaErrorHandling<UserConsultationRow[]>(() =>
    prisma.consultation.findMany({
      where: { userId },
      include: {
        doctor: {
          select: { firstName: true, lastName: true, speciality: true },
        },
      },
    })
  );
}

export async function selectDoctorConsultations(
  doctorId: number
): Promise<DoctorConsultationRow[]> {
  return await withPrismaErrorHandling<DoctorConsultationRow[]>(() =>
    prisma.consultation.findMany({
      where: { doctorId },
      include: {
        user: {
          select: { firstName: true, lastName: true, phoneNumber: true, email: true },
        },
      },
    })
  );
}

export async function selectAllConsultations(): Promise<ConsultationRow[]> {
  return await withPrismaErrorHandling<ConsultationRow[]>(() =>
    prisma.consultation.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
        doctor: {
          select: { firstName: true, lastName: true },
        },
      },
    })
  );
}
