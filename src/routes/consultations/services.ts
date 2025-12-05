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
  if (!result) throwNotFoundError('Consultation not found');
  return types.mapConsultationRowToConsultation(result);
}

export async function getAllConsultations(): Promise<types.Consultation[]> {
  const rows = await models.selectAllConsultations();
  return rows.map(types.mapConsultationRowToConsultation);
}

export async function getUserConsultations(userId: number): Promise<types.UserConsultation[]> {
  const rows = await models.selectUserConsultations(userId);
  return rows.map(types.mapUserConsultationRowToUserConsultation);
}

export async function getDoctorConsultations(
  doctorId: number
): Promise<types.DoctorConsultation[]> {
  const rows = await models.selectDoctorConsultations(doctorId);
  return rows.map(types.mapDoctorConsultationRowToDoctorConsultation);
}

export async function softDeleteConsultation(
  consultationId: number
): Promise<Pick<types.Consultation, 'id'>> {
  return await models.softDeleteConsultation(consultationId);
}

export async function restoreConsultation(consultationId: number): Promise<types.Consultation> {
  const row = await models.restoreConsultation(consultationId);
  return types.mapConsultationRowToConsultation(row);
}

export async function updateConsultationStatus(
  consultationId: number,
  status: types.ConsultationStatus
): Promise<types.Consultation> {
  const row = await models.updateConsultationStatus(consultationId, status);
  return types.mapConsultationRowToConsultation(row);
}

export async function updateConsultationNotes(
  consultationId: number,
  notes: string
): Promise<types.Consultation> {
  const row = await models.updateConsultationNotes(consultationId, notes);
  return types.mapConsultationRowToConsultation(row);
}

export async function getConsultationCountsByStatus(): Promise<
  Record<types.ConsultationStatus, number>
> {
  return await models.countConsultationsByStatus();
}
