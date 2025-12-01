import * as m from './types.ts';
import type * as t from './types.ts';
import * as model from './models.ts';
import { throwNotFoundError, throwServerError } from '../../utils/AppError.ts';

export async function registerReferral(body: t.PostReferral): Promise<Pick<t.Referral, 'id'>> {
  return (await model.insertReferral(body)) ?? throwServerError();
}

export async function getReferralById(id: number): Promise<t.Referral> {
  const result = await model.selectReferralById(id);
  if (!result) {
    throwNotFoundError('Referral not found with the provided ID');
  }
  return m.mapReferralRowToReferral(result);
}

export async function getAllReferrals(): Promise<t.Referral[]> {
  const referrals = await model.selectAllReferrals();
  return referrals.map(m.mapReferralRowToReferral);
}

export async function getReferralsByConsultationId(consultationId: number): Promise<t.Referral[]> {
  const referrals = await model.selectReferralsByConsultationId(consultationId);
  return referrals.map(m.mapReferralRowToReferral);
}

export async function getUserReferralsByUserId(userId: number): Promise<t.UserReferral[]> {
  const referrals = await model.selectUserReferrals(userId);
  return referrals.map(m.mapUserReferralRowToUserReferral);
}

export async function getDoctorReferralsByDoctorId(doctorId: number): Promise<t.DoctorReferral[]> {
  const referrals = await model.selectDoctorReferrals(doctorId);
  return referrals.map(m.mapDoctorReferralRowToDoctorReferral);
}
