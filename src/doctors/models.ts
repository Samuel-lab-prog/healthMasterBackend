import { DatabaseError } from 'pg';
import { AppError } from '../utils/AppError.ts';
import { pool } from '../db/connection.ts';
import { mapDoctorRowToFullDoctor } from './types';
import type { Doctor, FullDoctor, DoctorRow, InsertDoctor } from './types';

const isProd = process.env.NODE_ENV === 'production';
async function selectDoctorInternal(
  field: 'email' | 'id' | 'phone_number' | 'crm',
  value: string | number
): Promise<FullDoctor | null> {
  const query = `SELECT * FROM Doctors WHERE ${field} = $1 LIMIT 2`;

  try {
    const { rows } = await pool.query<DoctorRow>(query, [value]);

    if (!rows[0]) return null;

    if (rows.length > 1) {
      throw new AppError({
        statusCode: 500,
        errorMessages: [`Duplicate Doctors detected for ${field}: ${value}`],
      });
    }

    return mapDoctorRowToFullDoctor(rows[0]);
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError({
      statusCode: 500,
      errorMessages: ['Database internal error while fetching Doctor'],
      originalError: isProd ? undefined : (error as Error),
    });
  }
}
export async function selectDoctorByEmail(email: string): Promise<FullDoctor | null> {
  return await selectDoctorInternal('email', email);
}

export async function selectDoctorById(id: number): Promise<FullDoctor | null> {
  return await selectDoctorInternal('id', id);
}

export async function selectDoctorByPhoneNumber(phoneNumber: string): Promise<FullDoctor | null> {
  return await selectDoctorInternal('phone_number', phoneNumber);
}

export async function selectDoctorByCRM(crm: string): Promise<FullDoctor | null> {
  return await selectDoctorInternal('crm', crm);
}

export async function insertDoctor(DoctorData: InsertDoctor): Promise<Pick<Doctor, 'id'>> {
  const { firstName, lastName, email, passwordHash, phoneNumber, speciality, crm, role } =
    DoctorData;
  const query = `
    INSERT INTO Doctors (first_name, last_name, email, password_hash, phone_number, speciality, crm, role)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
  `;
  const values = [firstName, lastName, email, passwordHash, phoneNumber, speciality, crm, role];
  try {
    const { rows } = await pool.query<Pick<Doctor, 'id'>>(query, values);

    if (!rows[0]) {
      throw new AppError({
        statusCode: 500,
        errorMessages: ['Failed to create Doctor: no DoctorId returned from database'],
      });
    }

    return { id: rows[0].id };
  } catch (error: unknown) {
    if (error instanceof DatabaseError && error.code === '23505') {
      if (error.detail?.includes('email')) {
        throw new AppError({
          statusCode: 409,
          errorMessages: ['Email already in use'],
        });
      }
      if (error.detail?.includes('phone_number')) {
        throw new AppError({
          statusCode: 409,
          errorMessages: ['Phone number already in use'],
        });
      }
      if (error.detail?.includes('crm')) {
        throw new AppError({
          statusCode: 409,
          errorMessages: ['CRM already in use'],
        });
      }
    }

    if (error instanceof AppError) throw error;

    throw new AppError({
      statusCode: 500,
      errorMessages: ['Database internal error while creating Doctor'],
      originalError: isProd ? undefined : (error as Error),
    });
  }
}
