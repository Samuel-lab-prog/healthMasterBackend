import { AppError } from '../../utils/AppError.ts';
import { runQuery } from '../../db/utils.ts';
import { mapConsultationRowToFullConsultation } from './types';
import type {
  Consultation,
  FullConsultation,
  ConsultationRow,
  InsertConsultation,
  UserConsultation,
  DoctorConsultation,
} from './types';

export async function selectConsultationById(id: number): Promise<FullConsultation | null> {
  const query = `SELECT * FROM consultations WHERE id = $1 LIMIT 2`;
  const rows = await runQuery<ConsultationRow>(query, [id]);
  if (!rows[0]) {
    return null;
  }
  if (rows.length > 1) {
    throw new AppError({
      statusCode: 500,
      errorMessages: [`Data integrity violation: duplicated consultations for id = ${id}`],
      origin: 'database',
    });
  }
  return mapConsultationRowToFullConsultation(rows[0]);
}

export async function insertConsultation(
  ConsultationData: InsertConsultation
): Promise<Pick<Consultation, 'id'> | null> {
  const { userId, doctorId, consultationDate, notes } = ConsultationData;
  const values = [userId, doctorId, consultationDate, notes];
  const query = `
    INSERT INTO consultations (user_id, doctor_id, consultation_date, notes)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;
  const rows = await runQuery<Pick<Consultation, 'id'>>(query, values);

  if (!rows[0] || !rows[0].id) {
    return null;
  }
  return { id: rows[0].id };
}

export async function selectUserConsultationsByUserId(
  userId: number
): Promise<UserConsultation[] | null> {
  const query = `SELECT
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
  const rows = await runQuery<UserConsultation>(query, [userId]);
  if (rows.length === 0) {
    return null;
  }
  return rows;
}

export async function selectDoctorConsultationsByDoctorId(
  doctorId: number
): Promise<DoctorConsultation[] | null> {
  const query = `SELECT
      u.id AS "userId",
      c.id AS "consultationId",
      c.consultation_date AS "consultationDate",
      (u.first_name || ' ' || u.last_name) AS "userName",
      c.notes AS "consultationNotes"
    FROM consultations c
    JOIN users u ON c.user_id = u.id
    WHERE c.doctor_id = $1
    ORDER BY c.consultation_date DESC`;
  const rows = await runQuery<DoctorConsultation>(query, [doctorId]);
  if (rows.length === 0) {
    return null;
  }
  return rows;
}
