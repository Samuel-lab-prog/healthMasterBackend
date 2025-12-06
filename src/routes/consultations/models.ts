import { prisma } from '../../prisma/client.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import type * as types from './types.ts';

const userInclude = {
  select: {
    firstName: true,
    lastName: true,
    phoneNumber: true,
    email: true,
  },
};

const doctorInclude = {
  select: {
    firstName: true,
    lastName: true,
    speciality: true,
  },
};

const consultationIncludes = {
  user: { select: { firstName: true, lastName: true } },
  doctor: { select: { firstName: true, lastName: true, speciality: true } },
};

export function insertConsultation(
  data: types.InsertConsultation
): Promise<Pick<types.ConsultationRow, 'id'>> {
  return withPrismaErrorHandling<Pick<types.ConsultationRow, 'id'>>(() =>
    prisma.consultation.create({
      data,
      select: { id: true },
    })
  );
}

export function selectConsultationById(
  consultationId: number
): Promise<types.ConsultationRow | null> {
  return withPrismaErrorHandling<types.ConsultationRow | null>(() =>
    prisma.consultation.findUnique({
      where: { id: consultationId },
      include: consultationIncludes,
    })
  );
}

export function selectAllConsultations(): Promise<types.ConsultationRow[]> {
  return withPrismaErrorHandling<types.ConsultationRow[]>(() =>
    prisma.consultation.findMany({
      include: consultationIncludes,
    })
  );
}

export function selectUserConsultations(userId: number): Promise<types.UserConsultationRow[]> {
  return withPrismaErrorHandling<types.UserConsultationRow[]>(() =>
    prisma.consultation.findMany({
      where: { userId },
      include: { doctor: doctorInclude },
    })
  );
}

export function selectDoctorConsultations(
  doctorId: number
): Promise<types.DoctorConsultationRow[]> {
  return withPrismaErrorHandling<types.DoctorConsultationRow[]>(() =>
    prisma.consultation.findMany({
      where: { doctorId },
      include: { user: userInclude },
    })
  );
}

export function softDeleteConsultation(
  consultationId: number
): Promise<Pick<types.ConsultationRow, 'id'>> {
  return withPrismaErrorHandling<Pick<types.ConsultationRow, 'id'>>(() =>
    prisma.consultation.update({
      where: { id: consultationId },
      data: { deletedAt: new Date() },
      select: { id: true },
    })
  );
}

export function restoreConsultation(consultationId: number): Promise<types.ConsultationRow> {
  return withPrismaErrorHandling<types.ConsultationRow>(() =>
    prisma.consultation.update({
      where: { id: consultationId },
      data: { deletedAt: null },
      include: consultationIncludes,
    })
  );
}

export function updateConsultationStatus(
  consultationId: number,
  status: types.ConsultationStatus
): Promise<types.ConsultationRow> {
  return withPrismaErrorHandling<types.ConsultationRow>(() =>
    prisma.consultation.update({
      where: { id: consultationId },
      data: { status },
      include: consultationIncludes,
    })
  );
}

export function updateConsultationNotes(
  consultationId: number,
  notes: string
): Promise<types.ConsultationRow> {
  return withPrismaErrorHandling<types.ConsultationRow>(() =>
    prisma.consultation.update({
      where: { id: consultationId },
      data: { notes },
      include: consultationIncludes,
    })
  );
}

export function countConsultationsByStatus(): Promise<Record<types.ConsultationStatus, number>> {
  return withPrismaErrorHandling(async () => {
    const rows = await prisma.consultation.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const result: Record<types.ConsultationStatus, number> = {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      no_show: 0,
    };

    rows.forEach((r) => {
      result[r.status as types.ConsultationStatus] = r._count.status;
    });

    return result;
  });
}

export async function selectAllDeletedConsultations(): Promise<types.ConsultationRow[]> {
  return withPrismaErrorHandling<types.ConsultationRow[]>(() =>
    prisma.consultation.findMany({
      where: { deletedAt: { not: null } },
      include: consultationIncludes,
    })
  );
}
