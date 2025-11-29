import { runQuery } from '../../db/utils.ts';
import { mapReferralRowToFullReferral } from './types.ts';
import type { Referral, FullReferral, ReferralRow, InsertReferral } from './types.ts';

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

  const rows = await runQuery<{ id: number }, { id: number }>(query, values, (row) => ({
    id: row.id,
  }));
  return rows[0] ?? null;
}

export async function selectAllReferrals(): Promise<FullReferral[]> {
  const query = `SELECT * FROM referrals`;
  const rows = await runQuery<ReferralRow, FullReferral>(query, [], mapReferralRowToFullReferral);
  return rows ?? [];
}

export async function selectReferralsByConsultationId(
  consultationId: number
): Promise<FullReferral[]> {
  const query = `SELECT * FROM referrals WHERE consultation_id = $1`;
  const rows = await runQuery<ReferralRow, FullReferral>(
    query,
    [consultationId],
    mapReferralRowToFullReferral
  );
  return rows ?? [];
}

export async function selectUserReferralsByUserId(userId: number): Promise<FullReferral[]> {
  const query = `SELECT
    r.*
  FROM referrals r
  JOIN consultations c ON r.consultation_id = c.id
  WHERE c.user_id = $1`;

  const rows = await runQuery<ReferralRow, FullReferral>(
    query,
    [userId],
    mapReferralRowToFullReferral
  );
  return rows ?? [];
}

export async function selectDoctorReferralsByDoctorId(doctorId: number): Promise<FullReferral[]> {
  const query = `SELECT
    r.*
  FROM referrals r
  JOIN consultations c ON r.consultation_id = c.id
  WHERE c.doctor_id = $1`;

  const rows = await runQuery<ReferralRow, FullReferral>(
    query,
    [doctorId],
    mapReferralRowToFullReferral
  );
  return rows ?? [];
}
