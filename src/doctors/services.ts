import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError.ts';
import { mapFullDoctorToDoctor } from './types.ts';
import { generateToken, verifyToken, type Payload } from '../utils/jwt.ts';
import { insertDoctor, selectDoctorByEmail, selectDoctorById } from './models.ts';
import type { FullDoctor, PostDoctor, Doctor } from './types.ts';

function ensureDoctorExists(Doctor: FullDoctor | null): void {
  if (!Doctor) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['Doctor not found'],
    });
  }
}

export async function registerDoctor(body: PostDoctor): Promise<Pick<Doctor, 'id'>> {
  const passwordHash = await bcrypt.hash(
    body.password,
    process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10
  );

  return await insertDoctor({
    ...body,
    passwordHash: passwordHash,
  });
}

export async function loginDoctor(body: {
  email: string;
  password: string;
}): Promise<{ token: string; Doctor: Doctor }> {
  const Doctor = await selectDoctorByEmail(body.email);
  ensureDoctorExists(Doctor);

  if (!(await bcrypt.compare(body.password, Doctor!.passwordHash))) {
    throw new AppError({
      statusCode: 401,
      errorMessages: ['Invalid credentials'],
    });
  }

  const token = generateToken({
    id: Doctor!.id,
    email: Doctor!.email,
  } as Payload);
  ensureDoctorExists(Doctor);
  return { token, Doctor: mapFullDoctorToDoctor(Doctor!) };
}

export async function authenticateDoctor(token: string): Promise<Doctor> {
  const payload = verifyToken(token) as Payload;
  const Doctor = await selectDoctorById(payload.id);
  ensureDoctorExists(Doctor);
  return mapFullDoctorToDoctor(Doctor!);
}
