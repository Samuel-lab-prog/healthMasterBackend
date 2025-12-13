import * as r from './repository.ts';
import * as t from './types.ts';
import { throwNotFoundError } from '../../utils/AppError.ts';

export async function registerConsultation(
  body: t.PostConsultation
): Promise<Pick<t.ConsultationRow, 'id'>> {
  return await r.insertConsultation(body);
}

export async function getAllConsultations(): Promise<t.ConsultationRow[]> {
  return await r.selectAllConsultations()
}

export async function getAllDeletedConsultations(): Promise<t.ConsultationRow[]> {
  return await r.selectAllDeletedConsultations();
}

export async function getUserConsultations(userId: number): Promise<t.ConsultationRow[]> {
  return await r.selectConsultationsByUserId(userId);
}

export async function getDoctorConsultations(
  doctorId: number
): Promise<t.ConsultationRow[]> {
  return await r.selectConsultationsByDoctorId(doctorId);
}

export async function getConsultationById(id: number): Promise<t.ConsultationRow> {
  const result = await r.selectConsultationById(id);
  if (!result) throwNotFoundError('Consultation not found');
  return result
}

export async function getDeletedConsultationById(
  id: number
): Promise<t.ConsultationRow> {
  const result = await r.selectDeletedConsultationById(id);
  if (!result) throwNotFoundError('Consultation not found');
  return result
}

export async function patchConsultationNotesById(
  consultationId: number,
  notes: string
): Promise<t.ConsultationRow> {
  return await r.updateConsultationNotes(consultationId, notes);
}

export async function patchConsultationStatusById(
  consultationId: number,
  status: t.ConsultationStatus
): Promise<t.ConsultationRow> {
  return await r.updateConsultationStatus(consultationId, status);
}

export async function softRemoveConsultationById(
  consultationId: number
): Promise<{ id: number }> {
  return await r.softDeleteConsultation(consultationId);
}