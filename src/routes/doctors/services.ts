import bcrypt from 'bcryptjs';
import {
  throwForbiddenError,
  throwNotFoundError,
  throwServerError,
  throwUnauthorizedError,
} from '../../utils/AppError.ts';
import {
  insertDoctor,
  selectDoctorByCRM,
  selectDoctorByEmail,
  selectDoctorById,
  selectAllDoctors,
} from './models.ts';
import { mapFullDoctorToDoctor } from './types.ts';
import { generateDoctorToken, verifyDoctorToken, type DoctorPayload } from '../../utils/jwt.ts';
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

  if (!result) {
    throwServerError(); // This should not happen under normal circumstances
  }
  return result;
}

export async function getAllDoctors(): Promise<Doctor[]> {
  const doctors = await selectAllDoctors();
  return doctors.map(mapFullDoctorToDoctor);
}

export async function authenticateDoctor(token: string): Promise<Doctor> {
  const payload = verifyDoctorToken(token) as DoctorPayload;

  if (!payload.crm) {
    throwUnauthorizedError('Invalid token: CRM missing');
  }
  const doctor = await selectDoctorByCRM(payload.crm);
  if (!doctor) {
    throwNotFoundError('Doctor not found with provided CRM');
  }

  return mapFullDoctorToDoctor(doctor!);
}

export async function loginDoctor(body: {
  email: string;
  password: string;
}): Promise<{ token: string; doctor: Doctor }> {
  const doctor = await selectDoctorByEmail(body.email);

  if (!doctor) {
    throwNotFoundError('Doctor not found with provided email');
  }
  if (!(await bcrypt.compare(body.password, doctor.passwordHash))) {
    throwUnauthorizedError('Invalid credentials');
  }

  const token = generateDoctorToken({
    id: doctor.id,
    email: doctor.email,
    crm: doctor.crm,
  } as DoctorPayload);

  return { token, doctor: mapFullDoctorToDoctor(doctor) };
}

export async function authenticateAdmin(id: number): Promise<Doctor> {
  const doctor = await selectDoctorById(id);

  if (!doctor) {
    throwNotFoundError('Doctor not found with provided ID');
  }
  if (doctor.role !== 'admin') {
    throwForbiddenError('Doctor is not an admin');
  }

  return mapFullDoctorToDoctor(doctor);
}
