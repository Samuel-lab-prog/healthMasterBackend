import { prisma } from '../../prisma/client.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import type {
  ConsultationRow,
  UserConsultationRow,
  DoctorConsultationRow,
  InsertConsultation,
} from './types.ts';

export async function insertConsultation(
  data: InsertConsultation
): Promise<Pick<ConsultationRow, 'id'>> {
  return withPrismaErrorHandling(() =>
    prisma.consultation.create({
      data: data,
      select: { id: true },
    })
  );
}

export async function selectConsultationById(
  consultationId: number
): Promise<ConsultationRow | null> {
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

export async function selectAllConsultations(): Promise<ConsultationRow[]> {
  return withPrismaErrorHandling(() =>
    prisma.consultation.findMany({
      include: {
        user: { select: { firstName: true, lastName: true } },
        doctor: { select: { firstName: true, lastName: true } },
      },
    })
  );
}

export async function selectUserConsultations(userId: number): Promise<UserConsultationRow[]> {
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
): Promise<DoctorConsultationRow[]> {
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
