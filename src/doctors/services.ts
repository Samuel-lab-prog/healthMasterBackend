import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError.ts';
import { mapFullDoctorToDoctor } from './types.ts';
import { generateDoctorToken, verifyDoctorToken, type DoctorPayload } from '../utils/jwt.ts';
import {
  insertDoctor,
  selectDoctorByCRM,
  selectDoctorByEmail,
  selectDoctorById,
  selectAllDoctors,
} from './models.ts';
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
}): Promise<{ token: string; doctor: Doctor }> {
  const doctor = await selectDoctorByEmail(body.email);
  ensureDoctorExists(doctor);

  if (!(await bcrypt.compare(body.password, doctor!.passwordHash))) {
    throw new AppError({
      statusCode: 401,
      errorMessages: ['Invalid credentials'],
    });
  }

  const token = generateDoctorToken({
    id: doctor!.id,
    email: doctor!.email,
    crm: doctor!.crm,
  } as DoctorPayload);
  ensureDoctorExists(doctor);
  return { token, doctor: mapFullDoctorToDoctor(doctor!) };
}

export async function authenticateDoctor(token: string): Promise<Doctor> {
  const payload = verifyDoctorToken(token) as DoctorPayload;
  if (!payload.crm) {
    throw new AppError({
      statusCode: 401,
      errorMessages: ['Invalid token payload: CRM is required'],
    });
  }
  const doctor = await selectDoctorByCRM(payload.crm);
  ensureDoctorExists(doctor);
  return mapFullDoctorToDoctor(doctor!);
}

export async function authenticateAdmin(id: number): Promise<Doctor> {
  const doctor = await selectDoctorById(id);
  ensureDoctorExists(doctor);
  if (doctor!.role !== 'admin') {
    throw new AppError({
      statusCode: 403,
      errorMessages: ['Access denied: Admins only'],
    });
  }
  return mapFullDoctorToDoctor(doctor!);
}

export async function getAllDoctors(): Promise<Doctor[]> {
  const doctors = await selectAllDoctors();

  if (doctors.length === 0) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['No doctors found'],
    });
  }

  return doctors.map(mapFullDoctorToDoctor);
}
