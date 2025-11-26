import { AppError } from '../utils/AppError.ts';
import { pool } from '../db/connection.ts';
import { mapReferralRowToFullReferral } from './types';
import type { Referral, FullReferral, ReferralRow, InsertReferral } from './types';
import { DatabaseError } from 'pg';

const isProd = false;

export async function selectReferralById(id: number): Promise<FullReferral | null> {
  const query = `SELECT * FROM Referrals WHERE id = $1 LIMIT 2`;
  try {
    const { rows } = await pool.query<ReferralRow>(query, [id]);

    if (!rows[0]) return null;
    if (rows.length > 1) {
      throw new AppError({
        statusCode: 500,
        errorMessages: [`Duplicate Referrals detected for id: ${id}`],
      });
    }
    return mapReferralRowToFullReferral(rows[0]);
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof DatabaseError && error.code === '23503') {
      throw new AppError({
        statusCode: 400,
        errorMessages: ['Invalid consultationId: foreign key constraint violation'],
      });
    }
    throw new AppError({
      statusCode: 500,
      errorMessages: ['Database internal error while fetching referral'],
      originalError: isProd ? undefined : (error as Error),
    });
  }
}

export async function insertReferral(referralData: InsertReferral): Promise<Pick<Referral, 'id'>> {
  const { notes, consultationId } = referralData;
  const query = `
    INSERT INTO referrals (consultation_id, notes)
    VALUES ($1, $2)
    RETURNING id
  `;
  const values = [consultationId, notes];
  try {
    const { rows } = await pool.query<Pick<Referral, 'id'>>(query, values);

    if (!rows[0]) {
      throw new AppError({
        statusCode: 500,
        errorMessages: ['Failed to create Referral: no referralId returned from database'],
      });
    }

    return { id: rows[0].id };
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new AppError({
      statusCode: 500,
      errorMessages: ['Database internal error while creating referral'],
      originalError: isProd ? undefined : (error as Error),
    });
  }
}
