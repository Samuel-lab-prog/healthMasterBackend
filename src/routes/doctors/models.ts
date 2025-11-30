import { mapDoctorRowToFullDoctor } from './types';
import { runQuery } from '../../db/utils.ts';
import type { Doctor, DoctorRow, FullDoctor, InsertDoctor } from './types';

export async function insertDoctor(data: InsertDoctor): Promise<Pick<Doctor, 'id'>> {
  const { passwordHash, firstName, lastName, email, phoneNumber, crm, cpf, speciality, role } =
    data;

  const values = [
    firstName,
    lastName,
    email,
    phoneNumber,
    crm,
    cpf,
    speciality,
    role,
    passwordHash,
  ];

  const query = `
    INSERT INTO doctors (first_name, last_name, email, phone_number, crm, cpf, speciality, role, password_hash)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `;

  return await runQuery<{ id: number }, { id: number }>(
    query,
    values,
    (row) => ({
      id: row.id,
    }),
    { expectSingleRow: true }
  );
}

export async function selectAllDoctors(): Promise<FullDoctor[]> {
  const query = `SELECT * FROM doctors ORDER BY id ASC`;
  return await runQuery<DoctorRow, FullDoctor>(query, [], mapDoctorRowToFullDoctor);
}

export async function selectDoctorByField(
  field: 'email' | 'id' | 'phone_number' | 'crm' | 'cpf',
  value: string | number
): Promise<FullDoctor> {
  const query = `SELECT * FROM Doctors WHERE ${field} = $1`;

  return await runQuery<DoctorRow, FullDoctor>(query, [value], mapDoctorRowToFullDoctor, {
    expectSingleRow: true,
    throwIfNoRows: true,
  });
}
