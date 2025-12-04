import { prisma } from '../../prisma/client.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import type * as types from './types.ts';

export async function insertConsultation(
  data: types.InsertConsultation
): Promise<Pick<types.ConsultationRow, 'id'>> {
  return withPrismaErrorHandling(() =>
    prisma.consultation.create({
      data: data,
      select: { id: true },
    })
  );
}

export async function selectConsultationById(
  consultationId: number
): Promise<types.ConsultationRow | null> {
  return withPrismaErrorHandling(() =>
    prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        user: { select: { firstName: true, lastName: true } },
        doctor: { select: { firstName: true, lastName: true } },
      },
    })
  );
}

export async function selectAllConsultations(): Promise<types.ConsultationRow[]> {
  return withPrismaErrorHandling(() =>
    prisma.consultation.findMany({
      include: {
        user: { select: { firstName: true, lastName: true } },
        doctor: { select: { firstName: true, lastName: true } },
      },
    })
  );
}

export async function selectUserConsultations(userId: number): Promise<types.UserConsultationRow[]> {
  return withPrismaErrorHandling(() =>
    prisma.consultation.findMany({
      where: { userId },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            speciality: true,
          },
        },
      },
    })
  );
}

export async function selectDoctorConsultations(
  doctorId: number
): Promise<types.DoctorConsultationRow[]> {
  return withPrismaErrorHandling(() =>
    prisma.consultation.findMany({
      where: { doctorId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
            email: true,
          },
        },
      },
    })
  );
}
