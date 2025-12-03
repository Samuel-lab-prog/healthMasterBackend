import * as m from './models.ts';
import * as t from './types.ts';
import { throwNotFoundError, throwServerError } from '../../utils/AppError.ts';

export async function registerConsultation(
  body: t.PostConsultation
): Promise<Pick<t.Consultation, 'id'>> {
  return (await m.insertConsultation(body)) ?? throwServerError();
}

export async function getConsultationById(id: number): Promise<t.Consultation> {
  const result = await m.selectConsultationById(id);
  if (!result) {
    throwNotFoundError('Consultation not found');
  }
  return t.mapConsultationRowToConsultation(result);
}

export async function getUserConsultations(userId: number): Promise<t.UserConsultation[]> {
  const result = await m.selectUserConsultations(userId);
  return result.map(t.mapUserConsultationRowToUserConsultation);
}

export async function getDoctorConsultations(doctorId: number): Promise<t.DoctorConsultation[]> {
  const result = await m.selectDoctorConsultations(doctorId);
  return result.map(t.mapDoctorConsultationRowToDoctorConsultation);
}

export async function getAllConsultations(): Promise<t.Consultation[]> {
  const result = await m.selectAllConsultations();
  return result.map(t.mapConsultationRowToConsultation);
}
