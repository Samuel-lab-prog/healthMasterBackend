import { DatabaseError } from 'pg';
import { AppError } from '../utils/AppError.ts';
import { pool } from '../db/connection.ts';
import { mapConsultationRowToFullConsultation } from './types';
import type {
  Consultation,
  FullConsultation,
  ConsultationRow,
  InsertConsultation,
  UserConsultation,
  DoctorConsultation
} from './types';

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
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof DatabaseError) {
      if (error?.code === '23503') {
        throw new AppError({
          statusCode: 400,
          errorMessages: ['Invalid userId or doctorId: foreign key does not exist'],
          origin: 'database'
        });
      }
    }
    throw new AppError({
      statusCode: 500,
      errorMessages: ['Database internal error while creating Consultation'],
      originalError: isProd ? undefined : (error as Error),
    });
  }
}

export async function selectUserConsultationsByUserId(userId: number): Promise<UserConsultation[] | null> {
  const query =
    `SELECT
      d.id AS "doctorId",
      c.id AS "consultationId",
      d.speciality AS "doctorSpeciality",
      c.consultation_date AS "consultationDate",
      c.notes AS "consultationNotes",
      (d.first_name || ' ' || d.last_name) AS "doctorName"
    FROM consultations c
    JOIN doctors d ON c.doctor_id = d.id
    WHERE c.user_id = $1
    ORDER BY c.consultation_date DESC`;
  try {
    const { rows } = await pool.query<UserConsultation>(query, [userId]);
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error(error);
    throw new AppError({
      statusCode: 500,
      errorMessages: ['Database internal error while fetching User Consultations'],
      originalError: isProd ? undefined : (error as Error),
    });
  }
}

export async function selectDoctorConsultationsByDoctorId(doctorId: number): Promise<DoctorConsultation[] | null> {
  const query =
    `SELECT
      u.id AS "userId",
      c.id AS "consultationId",
      c.consultation_date AS "consultationDate",
      (u.first_name || ' ' || u.last_name) AS "userName",
      c.notes AS "consultationNotes"
    FROM consultations c
    JOIN users u ON c.user_id = u.id
    WHERE c.doctor_id = $1
    ORDER BY c.consultation_date DESC`;
  try {
    const { rows } = await pool.query<DoctorConsultation>(query, [doctorId]);
    if (rows.length === 0) {
      return null;
    }
    console.log(rows);
    return rows;
  } catch (error) {
    console.error(error);
    throw new AppError({
      statusCode: 500,
      errorMessages: ['Database internal error while fetching Doctor Consultations'],
      originalError: isProd ? undefined : (error as Error),
    });
  }
}