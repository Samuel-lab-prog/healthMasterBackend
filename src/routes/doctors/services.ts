import bcrypt from 'bcryptjs';
import { insertDoctor, selectAllDoctors } from './models.ts';
import { mapDoctorRowToDoctor } from './types.ts';
import type { PostDoctor, DoctorRow, Doctor } from './types.ts';

export async function registerDoctor(
  body: PostDoctor
): Promise<Pick<DoctorRow, 'id'>> {
  const saltRounds = Number(process.env.SALT_ROUNDS ?? 10);

  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  return insertDoctor({
    ...body,
    password: passwordHash,
  });
}

export async function getAllDoctors(): Promise<Doctor[]> {
  const doctors = await selectAllDoctors();
  return doctors.map(mapDoctorRowToDoctor);
}
