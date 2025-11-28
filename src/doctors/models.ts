import { mapDoctorRowToFullDoctor } from './types';
import {
  runQuery,
  createParams
} from '../db/utils.ts';
import type {
  Doctor,
  FullDoctor,
  DoctorRow,
  InsertDoctor
} from './types';

async function selectDoctorInternal(
  field: 'email' | 'id' | 'phone_number' | 'crm' | 'cpf',
  value: string | number
): Promise<FullDoctor | null> {
  const query = `SELECT * FROM Doctors WHERE ${field} = $1`;
  const rows = await runQuery<DoctorRow>(query, [value]);

  return rows[0] ? mapDoctorRowToFullDoctor(rows[0]) : null;
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

export async function selectDoctorByCPF(cpf: string): Promise<FullDoctor | null> {
  return await selectDoctorInternal('cpf', cpf);
}

export async function insertDoctor(data: InsertDoctor): Promise<Pick<Doctor, 'id'> | null> {
  const values = [
    data.firstName,
    data.lastName,
    data.email,
    data.passwordHash,
    data.phoneNumber,
    data.speciality,
    data.crm,
    data.role,
    data.birthDate,
    data.cpf,
  ];

  const placeholders = createParams(values);
  const query = `
    INSERT INTO doctors (
      first_name, last_name, email,
      password_hash, phone_number, speciality,
      crm, role, birth_date, cpf
    )
    VALUES (${placeholders})
    RETURNING id
  `;

  const rows = await runQuery<Pick<Doctor, 'id'>>(query, values);
  return rows[0] ?? null;
}

export async function selectAllDoctors(): Promise<FullDoctor[] | null> {
  const query = `SELECT * FROM doctors ORDER BY id ASC`;
  const rows = await runQuery<DoctorRow>(query);

  if (!rows || rows.length === 0) {
    return null;
  }

  return rows.map(mapDoctorRowToFullDoctor);
}
