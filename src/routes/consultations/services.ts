import * as models from './models.ts';
import * as types from './types.ts';
import { throwNotFoundError } from '../../utils/AppError.ts';

export async function registerConsultation(
  body: types.PostConsultation
): Promise<Pick<types.Consultation, 'id'>> {
  return await models.insertConsultation(body);
}

export async function getConsultationById(id: number): Promise<types.Consultation> {
  const result = await models.selectConsultationById(id);
  if (!result) {
    throwNotFoundError('Consultation not found');
  }
  return types.mapConsultationRowToConsultation(result);
}

export async function getUserConsultations(userId: number): Promise<types.UserConsultation[]> {
  const result = await models.selectUserConsultations(userId);
  return result.map(types.mapUserConsultationRowToUserConsultation);
}

export async function getDoctorConsultations(
  doctorId: number
): Promise<types.DoctorConsultation[]> {
  const result = await models.selectDoctorConsultations(doctorId);
  return result.map(types.mapDoctorConsultationRowToDoctorConsultation);
}

export async function getAllConsultations(): Promise<types.Consultation[]> {
  const result = await models.selectAllConsultations();
  return result.map(types.mapConsultationRowToConsultation);
}
