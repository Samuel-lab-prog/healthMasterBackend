import { mapDoctorRowToFullDoctor } from './types';
import { runQuery } from '../../db/utils.ts';
import type { Doctor, DoctorRow, FullDoctor, InsertDoctor } from './types';


function buildInsertData<T extends Record<string, unknown>>(obj: T) {
  const camelToSnake = (s: string) =>
    s.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());

  const keys = Object.keys(obj);
  const columns = keys.map(camelToSnake).join(', ');
  const values = keys.map(k => obj[k]);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

  const insertFragment = `(${columns}) VALUES (${placeholders})`;

  return {
    values,
    columns,
    placeholders,
    insertFragment
  };
}

export async function insertDoctor(data: InsertDoctor): Promise<Pick<Doctor, 'id'>> {
  const { values, insertFragment } = buildInsertData(data);
  const query = `
    INSERT INTO doctors ${insertFragment}
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