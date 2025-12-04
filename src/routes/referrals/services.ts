import * as models from './models.ts';
import * as types from './types.ts';
import { throwNotFoundError } from '../../utils/AppError.ts';

export async function registerReferral(
  body: types.PostReferral
): Promise<Pick<types.Referral, 'id'>> {
  const result = await models.insertReferral(body);

  return result;
}

export async function getReferralById(id: number): Promise<types.Referral> {
  const row = await models.selectReferralById(id);

  if (!row) {
    throwNotFoundError('Referral not found with the provided ID');
  }

  return types.mapReferralRowToReferral(row);
}

export async function getAllReferrals(): Promise<types.Referral[]> {
  const rows = await models.selectAllReferrals();
  return rows.map(types.mapReferralRowToReferral);
}

export async function getReferralsByConsultationId(
  consultationId: number
): Promise<types.Referral[]> {
  const rows = await models.selectReferralsByConsultationId(consultationId);
  return rows.map(types.mapReferralRowToReferral);
}

export async function getUserReferrals(userId: number): Promise<types.UserReferral[]> {
  const rows = await models.selectUserReferrals(userId);
  return rows.map(types.mapUserReferralRowToUserReferral);
}

export async function getDoctorReferrals(doctorId: number): Promise<types.DoctorReferral[]> {
  const rows = await models.selectDoctorReferrals(doctorId);
  return rows.map(types.mapDoctorReferralRowToDoctorReferral);
}

export async function updateReferralStatus(
  id: number,
  status: types.ReferralStatus
): Promise<types.Referral> {
  const row = await models.updateReferralStatus(id, status);
  return types.mapReferralRowToReferral(row);
}

export async function deleteReferral(id: number): Promise<Pick<types.Referral, 'id'>> {
  return await models.softDeleteReferral(id);
}
