import { AppError } from '../utils/AppError.ts';
import { mapUserRowToFullUser } from './types.ts';
import { runQuery, createParams } from '../db/utils.ts';
import type { User, FullUser, UserRow, InsertUser } from './types.ts';

async function selectUserInternal(
  field: 'email' | 'id' | 'phone_number' | 'cpf',
  value: string | number
): Promise<FullUser | null> {
  const query = `SELECT * FROM users WHERE ${field} = $1 LIMIT 2`;
  const rows = await runQuery<UserRow>(query, [value]);

  if (!rows[0]) {
    return null;
  }
  if (rows.length > 1) {
    throw new AppError({
      statusCode: 500,
      errorMessages: [`Duplicate users detected for ${field}: ${value}`],
      origin: 'database',
    });
  }

  return mapUserRowToFullUser(rows[0]);
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

export async function insertUser(userData: InsertUser): Promise<Pick<User, 'id'> | null> {
  const values = [
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.passwordHash,
    userData.phoneNumber,
    userData.cpf,
    userData.birthDate,
  ];
  const placeholders = createParams(values);
  const query = `
    INSERT INTO users (first_name, last_name, email, password_hash, phone_number, cpf, birth_date)
    VALUES (${placeholders})
    RETURNING id
  `;
  const rows = await runQuery<Pick<User, 'id'>>(query, values);
  return rows[0] ?? null;
}
