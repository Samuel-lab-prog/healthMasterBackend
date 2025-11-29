import { mapFullReferralToReferral } from './types.ts';
import {
  insertReferral,
  selectReferralById,
  selectAllReferrals,
  selectReferralsByConsultationId,
  selectUserReferralsByUserId,
  selectDoctorReferralsByDoctorId,
} from './models.ts';
import type { PostReferral, Referral } from './types.ts';
import { throwNotFoundError, throwServerError } from '../../utils/AppError.ts';

export async function registerReferral(body: PostReferral): Promise<Pick<Referral, 'id'>> {
  const result = await insertReferral(body);
  if (!result) throwServerError(); // This should not happen under normal circumstances
  return result;
}

export async function getReferralById(id: number): Promise<Referral> {
  const result = await selectReferralById(id);
  if (!result) {
    throwNotFoundError('Referral not found with the provided ID');
  }
  return mapFullReferralToReferral(result);
}

export async function getAllReferrals(): Promise<Referral[]> {
  const referrals = await selectAllReferrals();
  return referrals.map(mapFullReferralToReferral);
}

export async function getReferralsByConsultationId(consultationId: number): Promise<Referral[]> {
  const referrals = await selectReferralsByConsultationId(consultationId);
  return referrals.map(mapFullReferralToReferral);
}

export async function getUserReferralsByUserId(userId: number): Promise<Referral[]> {
  const referrals = await selectUserReferralsByUserId(userId);
  return referrals.map(mapFullReferralToReferral);
}

export async function getDoctorReferralsByDoctorId(doctorId: number): Promise<Referral[]> {
  const referrals = await selectDoctorReferralsByDoctorId(doctorId);
  return referrals.map(mapFullReferralToReferral);
}
