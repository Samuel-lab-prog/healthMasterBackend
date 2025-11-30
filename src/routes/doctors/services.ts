import bcrypt from 'bcryptjs';
import { insertDoctor, selectAllDoctors } from './models.ts';
import { mapFullDoctorToDoctor } from './types.ts';
import type { PostDoctor, Doctor } from './types.ts';

export async function registerDoctor(body: PostDoctor): Promise<Pick<Doctor, 'id'>> {
  const passwordHash = await bcrypt.hash(
    body.password,
    process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10
  );

  const result = await insertDoctor({
    ...body,
    passwordHash: passwordHash,
  });

  return result;
}

export async function getAllDoctors(): Promise<Doctor[]> {
  const doctors = await selectAllDoctors();
  return doctors.map(mapFullDoctorToDoctor);
}
