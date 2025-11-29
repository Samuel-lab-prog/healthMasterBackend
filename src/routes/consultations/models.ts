import { runQuery } from '../../db/utils.ts';
import {
  mapConsultationRowToFullConsultation,
  mapDoctorConsultationRowToDoctorConsultation,
  mapUserConsultationRowToUserConsultation,
} from './types';
import type {
  Consultation,
  FullConsultation,
  ConsultationRow,
  InsertConsultation,
  UserConsultationRow,
  UserConsultation,
  DoctorConsultationRow,
  DoctorConsultation,
} from './types';

export async function selectConsultationById(id: number): Promise<FullConsultation | null> {
  const query = `SELECT * FROM consultations WHERE id = $1`;
  const rows = await runQuery<ConsultationRow, FullConsultation>(
    query,
    [id],
    mapConsultationRowToFullConsultation
  );

  return rows[0] ?? null;
}

export async function insertConsultation(
  ConsultationData: InsertConsultation
): Promise<Pick<Consultation, 'id'> | null> {
  const { userId, doctorId, consultationDate, notes } = ConsultationData;

  const values = [userId, doctorId, consultationDate, notes];
  const query = `
    INSERT INTO consultations (user_id, doctor_id, date, notes)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

  const rows = await runQuery<{ id: number }, { id: number }>(query, values, (row) => ({
    id: row.id,
  }));
  return rows[0] ?? null;
}

export async function selectUserConsultationsByUserId(userId: number): Promise<UserConsultation[]> {
  const query = `SELECT
      c.id,
      c.notes,
      c.date,
      d.id AS "doctor_id",
      d.speciality AS "doctor_speciality",
      (d.first_name || ' ' || d.last_name) AS "doctor_name"
    FROM consultations c
    JOIN doctors d ON c.doctor_id = d.id
    WHERE c.user_id = $1
    ORDER BY c.date DESC`;
  const rows = await runQuery<UserConsultationRow, UserConsultation>(
    query,
    [userId],
    mapUserConsultationRowToUserConsultation
  );

  return rows ?? [];
}

export async function selectDoctorConsultationsByDoctorId(
  doctorId: number
): Promise<DoctorConsultation[]> {
  const query = `SELECT
      c.id,
      c.date,
      c.notes,
      u.id AS "user_id",
      (u.first_name || ' ' || u.last_name) AS "user_name"
    FROM consultations c
    JOIN users u ON c.user_id = u.id
    WHERE c.doctor_id = $1
    ORDER BY c.date DESC`;
  const rows = await runQuery<DoctorConsultationRow, DoctorConsultation>(
    query,
    [doctorId],
    mapDoctorConsultationRowToDoctorConsultation
  );
  return rows ?? [];
}
