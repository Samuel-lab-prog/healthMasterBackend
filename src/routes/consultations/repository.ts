import { prisma } from '../../prisma/client.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import * as t from './types.ts';

export function insertConsultation(
  data: t.InsertConsultation
): Promise<Pick<t.ConsultationRow, 'id'>> {
  return withPrismaErrorHandling<Pick<t.ConsultationRow, 'id'>>(() =>
    prisma.consultation.create({
      data,
      select: { id: true },
    })
  );
}

export function selectAllConsultations(): Promise<t.ConsultationRow[]> {
  return withPrismaErrorHandling<t.ConsultationRow[]>(() =>
    prisma.consultation.findMany({
      include: t.consultationIncludes,
      where: { deletedAt: null },
    })
  );
}

export async function selectAllDeletedConsultations(): Promise<t.ConsultationRow[]> {
  return withPrismaErrorHandling<t.ConsultationRow[]>(() =>
    prisma.consultation.findMany({
      where: { deletedAt: { not: null } },
      include: t.consultationIncludes,
    })
  );
}

export function selectConsultationsByUserId(id: number): Promise<t.ConsultationRow[]> {
  return withPrismaErrorHandling<t.ConsultationRow[]>(() =>
    prisma.consultation.findMany({
      where: { userId: id, deletedAt: null },
      include: t.consultationIncludes,
    })
  );
}

export function selectConsultationsByDoctorId(
  id: number
): Promise<t.ConsultationRow[]> {
  return withPrismaErrorHandling<t.ConsultationRow[]>(() =>
    prisma.consultation.findMany({
      where: { doctorId: id, deletedAt: null },
      include: t.consultationIncludes,
    })
  );
}

export async function selectDeletedConsultationById(
  id: number
): Promise<t.ConsultationRow | null> { 
  return withPrismaErrorHandling<t.ConsultationRow | null>(() =>
    prisma.consultation.findFirst({
      where: { id, deletedAt: { not: null } },
      include: t.consultationIncludes,
    })
  );
}

export function selectConsultationById(
  id: number
): Promise<t.ConsultationRow | null> {
  return withPrismaErrorHandling<t.ConsultationRow | null>(() =>
    prisma.consultation.findFirst({
      where: { id, deletedAt: null },
      include: t.consultationIncludes,
    })
  );
}

export function updateConsultationStatus(
  consultationId: number,
  status: t.ConsultationStatus
): Promise<t.ConsultationRow> {
  return withPrismaErrorHandling<t.ConsultationRow>(() =>
    prisma.consultation.update({
      where: { id: consultationId, deletedAt: null },
      data: { status },
      include: t.consultationIncludes,
    })
  );
}

export function updateConsultationNotes(
  consultationId: number,
  notes: string
): Promise<t.ConsultationRow> {
  return withPrismaErrorHandling<t.ConsultationRow>(() =>
    prisma.consultation.update({
      where: { id: consultationId, deletedAt: null },
      data: { notes },
      include: t.consultationIncludes,
    })
  );
}

export function softDeleteConsultation(
  consultationId: number
): Promise<Pick<t.ConsultationRow, 'id'>> {
  return withPrismaErrorHandling<Pick<t.ConsultationRow, 'id'>>(() =>
    prisma.consultation.update({
      where: { id: consultationId, deletedAt: null },
      data: { deletedAt: new Date() },
      select: { id: true },
    })
  );
}