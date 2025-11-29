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
import { throwServerError } from '../../utils/AppError.ts';
import { handleListResult, handleSingleResult } from '../../utils/functions.ts';

export async function registerReferral(body: PostReferral): Promise<Pick<Referral, 'id'>> {
  const result = await insertReferral(body);
  if (!result) throwServerError();
  return result;
}

export async function getReferralById(id: number): Promise<Referral> {
  return handleSingleResult(
    selectReferralById(id),
    'Referral not found',
    mapFullReferralToReferral
  );
}

export async function getAllReferrals(): Promise<Referral[]> {
  return handleListResult(
    selectAllReferrals(),
    'No referrals found',
    mapFullReferralToReferral
  );
}

export async function getReferralsByConsultationId(consultationId: number): Promise<Referral[]> {
  return handleListResult(
    selectReferralsByConsultationId(consultationId),
    'No referrals found for the given consultation ID',
    mapFullReferralToReferral
  );
}

export async function getUserReferralsByUserId(userId: number): Promise<Referral[]> {
  return handleListResult(
    selectUserReferralsByUserId(userId),
    'No referrals found for the given user ID',
    mapFullReferralToReferral
  );
}

export async function getDoctorReferralsByDoctorId(doctorId: number): Promise<Referral[]> {
  return handleListResult(
    selectDoctorReferralsByDoctorId(doctorId),
    'No referrals found for the given doctor ID',
    mapFullReferralToReferral
  );
}
