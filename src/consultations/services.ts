import { AppError } from '../utils/AppError.ts';
import { mapFullConsultationToConsultation } from './types.ts';
import {
  insertConsultation,
  selectConsultationById,
  selectUserConsultationsByUserId,
  selectDoctorConsultationsByDoctorId,
} from './models.ts';
import type {
  FullConsultation,
  PostConsultation,
  Consultation,
  UserConsultation,
  DoctorConsultation,
} from './types.ts';

function ensureConsultationExists(Consultation: FullConsultation | null): void {
  if (!Consultation) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['Consultation not found'],
    });
  }
}

export async function registerConsultation(
  body: PostConsultation
): Promise<Pick<Consultation, 'id'>> {
  return await insertConsultation(body);
}

export async function getConsultationById(id: number): Promise<Consultation> {
  const Consultation = await selectConsultationById(id);
  ensureConsultationExists(Consultation);
  return mapFullConsultationToConsultation(Consultation!);
}

export async function getUserConsultationsById(userId: number): Promise<UserConsultation[]> {
  const consultations = await selectUserConsultationsByUserId(userId);
  if (!consultations || consultations.length === 0) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['Consultations not found for user'],
    });
  }
  return consultations;
}

export async function getDoctorConsultationsById(doctorId: number): Promise<DoctorConsultation[]> {
  const consultations = await selectDoctorConsultationsByDoctorId(doctorId);
  if (!consultations || consultations.length === 0) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['Consultations not found for doctor'],
    });
  }
  return consultations;
}
