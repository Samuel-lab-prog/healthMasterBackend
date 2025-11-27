import { DatabaseError } from 'pg';
import { AppError } from '../utils/AppError.ts';
import { pool } from '../db/connection.ts';
import { mapUserRowToFullUser } from './types.ts';
import type { User, FullUser, UserRow, InsertUser } from './types.ts';

const isProd = process.env.NODE_ENV === 'production';

async function selectUserInternal(
  field: 'email' | 'id' | 'phone_number' | 'cpf',
  value: string | number
): Promise<FullUser | null> {
  const query = `SELECT * FROM users WHERE ${field} = $1 LIMIT 2`;

  try {
    const { rows } = await pool.query<UserRow>(query, [value]);

    if (!rows[0]) return null;

    if (rows.length > 1) {
      throw new AppError({
        statusCode: 500,
        errorMessages: [`Duplicate users detected for ${field}: ${value}`],
        origin: 'database',
      });
    }

    return mapUserRowToFullUser(rows[0]);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError({
      statusCode: 500,
      errorMessages: ['Database internal error while fetching user'],
      originalError: isProd ? undefined : (error as Error),
      origin: 'database',
    });
  }
}
export async function selectUserByEmail(email: string): Promise<FullUser | null> {
  return await selectUserInternal('email', email);
}

export async function selectUserById(id: number): Promise<FullUser | null> {
  return await selectUserInternal('id', id);
}

export async function selectUserByPhoneNumber(phoneNumber: string): Promise<FullUser | null> {
  return await selectUserInternal('phone_number', phoneNumber);
}

export async function selectUserByCPF(cpf: string): Promise<FullUser | null> {
  return await selectUserInternal('cpf', cpf);
}

export async function insertUser(userData: InsertUser): Promise<Pick<User, 'id'>> {
  const { firstName, lastName, email, passwordHash, phoneNumber, cpf, birthDate } = userData;
  const query = `
    INSERT INTO users (first_name, last_name, email, password_hash, phone_number, cpf, birth_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `;
  const values = [firstName, lastName, email, passwordHash, phoneNumber, cpf, birthDate];

  try {
    const { rows } = await pool.query<Pick<UserRow, 'id'>>(query, values);

    if (!rows[0]) {
      throw new AppError({
        statusCode: 500,
        errorMessages: ['Failed to create user: no userId returned from database'],
      });
    }
    return { id: rows[0].id };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;
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
      if (error.detail?.includes('cpf')) {
        throw new AppError({
          statusCode: 409,
          errorMessages: ['CPF already in use'],
        });
      }
    }
    throw new AppError({
      statusCode: 500,
      errorMessages: ['Database internal error while creating user'],
      origin: 'database',
      originalError: isProd ? undefined : (error as Error),
    });
  }
}
