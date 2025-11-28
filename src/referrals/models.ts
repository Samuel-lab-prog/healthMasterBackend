import { AppError } from '../utils/AppError.ts';
import { runQuery } from '../db/utils.ts';
import { mapReferralRowToFullReferral } from './types';
import type { Referral, FullReferral, ReferralRow, InsertReferral } from './types';

export async function selectReferralById(id: number): Promise<FullReferral | null> {
  const query = `SELECT * FROM referrals WHERE id = $1 LIMIT 2`;
  const rows = await runQuery<ReferralRow>(query, [id]);

  if (!rows[0]){
    return null;
  }    
  if (rows.length > 1) {
    throw new AppError({
      statusCode: 500,
      errorMessages: [`Data integrity violation: duplicated referrals for id = ${id}`],
      origin: 'database',
    });
  }
  return mapReferralRowToFullReferral(rows[0]);
}

export async function insertReferral(
  referralData: InsertReferral
): Promise<Pick<Referral, 'id'> | null> {
  const { notes, consultationId } = referralData;
  const values = [consultationId, notes];
  const query = `
    INSERT INTO referrals (consultation_id, notes)
    VALUES ($1, $2)
    RETURNING id
  `;
  const rows = await runQuery<Pick<Referral, 'id'>>(query, values);

  if (!rows[0] || !rows[0].id) {
    return null;
  }
  return { id: rows[0].id };
}

export async function selectAllReferrals(): Promise<FullReferral[] | null> {
  const query = `SELECT * FROM referrals`;
  const rows = await runQuery<ReferralRow>(query);
  if (!rows || rows.length === 0) {
    return null;
  }
  return rows.map(mapReferralRowToFullReferral);
}

export async function selectReferralsByConsultationId(
  consultationId: number
): Promise<FullReferral[] | null> {
  const query = `SELECT * FROM referrals WHERE consultation_id = $1`;
  const rows = await runQuery<ReferralRow>(query, [consultationId]);
  if (!rows || rows.length === 0) {
    return null;
  }
  return rows.map(mapReferralRowToFullReferral);
}

export async function selectUserReferralsByUserId(userId: number): Promise<FullReferral[] | null> {
  const query = `SELECT
    r.*
  FROM referrals r
  JOIN consultations c ON r.consultation_id = c.id
  WHERE c.user_id = $1`;
  const rows = await runQuery<ReferralRow>(query, [userId]);
  if (!rows || rows.length === 0) {
    return null;
  }
  return rows.map(mapReferralRowToFullReferral);
}

export async function selectDoctorReferralsByDoctorId(
  doctorId: number
): Promise<FullReferral[] | null> {
  const query = `SELECT
    r.*
  FROM referrals r
  JOIN consultations c ON r.consultation_id = c.id
  WHERE c.doctor_id = $1`;
  const rows = await runQuery<ReferralRow>(query, [doctorId]);
  if (!rows || rows.length === 0) {
    return null;
  }
  return rows.map(mapReferralRowToFullReferral);
}