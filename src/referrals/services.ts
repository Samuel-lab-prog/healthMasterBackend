import { AppError } from '../utils/AppError.ts';
import { mapFullReferralToReferral } from './types.ts';
import {
  insertReferral,
  selectReferralById,
  selectAllReferrals,
  selectReferralsByConsultationId,
  selectUserReferralsByUserId,
  selectDoctorReferralsByDoctorId,
} from './models.ts';
import type { FullReferral, PostReferral, Referral } from './types.ts';

function ensureReferralExists(Referral: FullReferral | null): void {
  if (!Referral) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['Referral not found'],
    });
  }
}

export async function registerReferral(body: PostReferral): Promise<Pick<Referral, 'id'>> {
  const result = await insertReferral(body);
  if (!result) {
    throw new AppError({
      statusCode: 500,
      errorMessages: ['Failed to create referral'],
    });
  }
  return result;
}

export async function getReferralById(id: number): Promise<Referral> {
  const Referral = await selectReferralById(id);
  ensureReferralExists(Referral);
  return mapFullReferralToReferral(Referral!);
}

export async function getAllReferrals(): Promise<Referral[]> {
  const fullReferrals = await selectAllReferrals();
  if (!fullReferrals) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['No referrals found'],
    });
  }
  return fullReferrals.map(mapFullReferralToReferral);
}

export async function getReferralsByConsultationId(consultationId: number): Promise<Referral[]> {
  const referrals = await selectReferralsByConsultationId(consultationId);
  if (!referrals) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['No referrals found for the given consultation ID'],
    });
  }
  return referrals.map(mapFullReferralToReferral);
}

export async function getUserReferralsByUserId(userId: number): Promise<Referral[]> {
  const referrals = await selectUserReferralsByUserId(userId);
  if (!referrals) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['No referrals found for the given user ID'],
    });
  }
  return referrals.map(mapFullReferralToReferral);
}

export async function getDoctorReferralsByDoctorId(doctorId: number): Promise<Referral[]> {
  const referrals = await selectDoctorReferralsByDoctorId(doctorId);
  if (!referrals) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['No referrals found for the given doctor ID'],
    });
  }
  return referrals.map(mapFullReferralToReferral);
}
