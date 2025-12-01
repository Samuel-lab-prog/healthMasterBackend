import {
  insertConsultation,
  selectConsultationById,
  selectAllConsultations,
  selectUserConsultations,
  selectDoctorConsultations,
} from './models.ts';
import {
  type PostConsultation,
  type Consultation,
  type UserConsultation,
  type DoctorConsultation,
  mapConsultationRowToConsultation,
  mapUserConsultationRowToUserConsultation,
  mapDoctorConsultationRowToDoctorConsultation,
} from './types.ts';
import { throwNotFoundError, throwServerError } from '../../utils/AppError.ts';

export async function registerConsultation(
  body: PostConsultation
): Promise<Pick<Consultation, 'id'>> {
  return (await insertConsultation(body)) ?? throwServerError();
}

export async function getConsultationById(id: number): Promise<Consultation> {
  const result = await selectConsultationById(id);
  if (!result) {
    throwNotFoundError('Consultation not found');
  }
  return mapConsultationRowToConsultation(result);
}

export async function getUserConsultations(userId: number): Promise<UserConsultation[]> {
  const result = await selectUserConsultations(userId);
  return result.map(mapUserConsultationRowToUserConsultation);
}

export async function getDoctorConsultations(doctorId: number): Promise<DoctorConsultation[]> {
  const result = await selectDoctorConsultations(doctorId);
  return result.map(mapDoctorConsultationRowToDoctorConsultation);
}

export async function getAllConsultations(): Promise<Consultation[]> {
  const result = await selectAllConsultations();
  return result.map(mapConsultationRowToConsultation);
}
