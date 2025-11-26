import { AppError } from '../utils/AppError.ts';
import { pool } from '../db/connection.ts';
import { mapConsultationRowToFullConsultation } from './types';
import type { Consultation, FullConsultation, ConsultationRow, InsertConsultation } from './types';

const isProd = false;

export async function selectConsultationById(id: number): Promise<FullConsultation | null> {
  const query = `SELECT * FROM Consultations WHERE id = $1 LIMIT 2`;
  try {
    const { rows } = await pool.query<ConsultationRow>(query, [id]);

    if (!rows[0]) return null;
    if (rows.length > 1) {
      throw new AppError({
        statusCode: 500,
        errorMessages: [`Duplicate Consultations detected for id: ${id}`],
      });
    }
    return mapConsultationRowToFullConsultation(rows[0]);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError({
      statusCode: 500,
      errorMessages: ['Database internal error while fetching Consultation'],
      originalError: isProd ? undefined : (error as Error),
    });
  }
}

export async function insertConsultation(
  ConsultationData: InsertConsultation
): Promise<Pick<Consultation, 'id'>> {
  const { userId, doctorId, consultationDate, notes } = ConsultationData;
  const query = `
    INSERT INTO Consultations (user_id, doctor_id, consultation_date, notes)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;
  const values = [userId, doctorId, consultationDate, notes];
  try {
    const { rows } = await pool.query<Pick<Consultation, 'id'>>(query, values);

    if (!rows[0]) {
      throw new AppError({
        statusCode: 500,
        errorMessages: ['Failed to create Consultation: no ConsultationId returned from database'],
      });
    }

    return { id: rows[0].id };
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new AppError({
      statusCode: 500,
      errorMessages: ['Database internal error while creating Consultation'],
      originalError: isProd ? undefined : (error as Error),
    });
  }
}
