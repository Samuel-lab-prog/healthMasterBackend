import { AppError } from '../utils/AppError.ts';
import { mapFullReferralToReferral } from './types.ts';
import { insertReferral, selectReferralById, selectAllReferrals } from './models.ts';
import type { FullReferral, PostReferral, Referral } from './types.ts';

function ensureReferralExists(Referral: FullReferral | null): void {
  if (!Referral) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['Referral not found'],
    });
  }
}

export async function registerReferral(
  body: PostReferral
): Promise<Pick<Referral, 'id'>> {
  return await insertReferral(body);
}

export async function getReferralById(id: number): Promise<Referral> {
  const Referral = await selectReferralById(id);
  ensureReferralExists(Referral);
  return mapFullReferralToReferral(Referral!);
}

export async function getAllReferrals(): Promise<Referral[]> {
  const fullReferrals = await selectAllReferrals();
  return fullReferrals.map(mapFullReferralToReferral);
}