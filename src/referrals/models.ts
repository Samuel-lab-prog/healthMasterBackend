import { DatabaseError } from 'pg';
import { AppError } from '../utils/AppError.ts';
import { pool } from '../db/connection.ts';
import { mapReferralRowToFullReferral } from './types';
import type { Referral, FullReferral, ReferralRow, InsertReferral } from './types';

const isProd = false;

export async function selectReferralById(id: number): Promise<FullReferral | null> {
  const query = `SELECT * FROM referrals WHERE id = $1 LIMIT 2`;

  try {
    const { rows } = await pool.query<ReferralRow>(query, [id]);

    if (!rows[0]) return null;
    if (rows.length > 1) {
      throw new AppError({
        statusCode: 500,
        errorMessages: [`Data integrity violation: duplicated referrals for id = ${id}`],
        origin: 'database',
      });
    }
    return mapReferralRowToFullReferral(rows[0]);
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError({
      statusCode: 500,
      errorMessages: ['Unknown database error: failed to fetch referral by id'],
      origin: 'database',
      originalError: isProd ? undefined : (error as Error),
    });
  }
}

export async function insertReferral(
  referralData: InsertReferral
): Promise<Pick<Referral, 'id'> | null> {
  const { notes, consultationId } = referralData;

  const query = `
    INSERT INTO referrals (consultation_id, notes)
    VALUES ($1, $2)
    RETURNING id
  `;

  const values = [consultationId, notes];

  try {
    const { rows } = await pool.query<Pick<ReferralRow, 'id'>>(query, values);

    if (!rows[0]) {
      throw new AppError({
        statusCode: 500,
        errorMessages: ['Unknown database error: no referral_id returned from database'],
        origin: 'database',
      });
    }

    return { id: rows[0].id };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof DatabaseError && error.code === '23503') {
      return null; // We do not throw an error here; the service layer will handle the null case
    }

    throw new AppError({
      statusCode: 500,
      errorMessages: ['Unknown database error: failed to insert referral'],
      origin: 'database',
      originalError: isProd ? undefined : (error as Error),
    });
  }
}

export async function selectAllReferrals(): Promise<FullReferral[]> {
  const query = `SELECT * FROM referrals`;

  try {
    const { rows } = await pool.query<ReferralRow>(query);

    return rows.map(mapReferralRowToFullReferral);
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError({
      statusCode: 500,
      errorMessages: ['Unknown database error: failed to fetch all referrals'],
      origin: 'database',
      originalError: isProd ? undefined : (error as Error),
    });
  }
}
