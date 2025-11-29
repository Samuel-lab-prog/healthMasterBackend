import { mapFullConsultationToConsultation } from './types.ts';
import {
  insertConsultation,
  selectConsultationById,
  selectUserConsultationsByUserId,
  selectDoctorConsultationsByDoctorId,
} from './models.ts';
import type {
  PostConsultation,
  Consultation,
  UserConsultation,
  DoctorConsultation,
} from './types.ts';
import { throwNotFoundError, throwServerError } from '../../utils/AppError.ts';

export async function registerConsultation(
  body: PostConsultation
): Promise<Pick<Consultation, 'id'>> {
  const result = await insertConsultation(body);

  if (!result) {
    throwServerError();
  }
  return result;
}

export async function getConsultationById(id: number): Promise<Consultation> {
  const result = await selectConsultationById(id);

  if (!result) {
    throwNotFoundError('Consultation not found with the provided ID');
  }
  return mapFullConsultationToConsultation(result);
}

export async function getUserConsultationsByUserId(userId: number): Promise<UserConsultation[]> {
  return await selectUserConsultationsByUserId(userId);
}

export async function getDoctorConsultationsByDoctorId(
  doctorId: number
): Promise<DoctorConsultation[]> {
  return await selectDoctorConsultationsByDoctorId(doctorId);
}
