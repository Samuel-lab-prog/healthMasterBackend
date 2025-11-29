import { runQuery } from '../../db/utils.ts';
import { mapReferralRowToFullReferral } from './types';
import type { Referral, FullReferral, ReferralRow, InsertReferral } from './types';

export async function selectReferralById(id: number): Promise<FullReferral | null> {

  const query = `SELECT * FROM referrals WHERE id = $1`;
  const rows = await runQuery<ReferralRow, FullReferral>(query, [id], mapReferralRowToFullReferral);
  return rows[0] ?? null;
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

  const rows = await runQuery<ReferralRow, {id: number}>(query, values, (row) => ({ id: row.id }));
  return rows[0] ?? null;
}

export async function selectAllReferrals(): Promise<FullReferral[] | null> {

  const query = `SELECT * FROM referrals`;
  const rows = await runQuery(query, [], mapReferralRowToFullReferral);
  return rows ?? null;
}

export async function selectReferralsByConsultationId(
  consultationId: number
): Promise<FullReferral[] | null> {

  const query = `SELECT * FROM referrals WHERE consultation_id = $1`;
  const rows = await runQuery(query, [consultationId], mapReferralRowToFullReferral);
  return rows ?? null;
}

export async function selectUserReferralsByUserId(userId: number): Promise<FullReferral[] | null> {
  const query = `SELECT
    r.*
  FROM referrals r
  JOIN consultations c ON r.consultation_id = c.id
  WHERE c.user_id = $1`;

  const rows = await runQuery(query, [userId], mapReferralRowToFullReferral);
  return rows ?? null;
}

export async function selectDoctorReferralsByDoctorId(
  doctorId: number
): Promise<FullReferral[] | null> {
  const query = `SELECT
    r.*
  FROM referrals r
  JOIN consultations c ON r.consultation_id = c.id
  WHERE c.doctor_id = $1`;

  const rows = await runQuery(query, [doctorId], mapReferralRowToFullReferral);
  return rows ?? null;
}
