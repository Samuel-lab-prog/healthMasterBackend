import { describe, it, beforeEach, expect } from 'bun:test';
import { prisma } from '../../prisma/client.ts';

import {
  insertConsultation,
  selectConsultationById,
  selectUserConsultations,
  selectDoctorConsultations,
} from './models.ts';

import type { CreateConsultation } from './types.ts';
import { insertDoctor } from '../doctors/models.ts';
import { insertUser } from '../users/models.ts';
import type { DoctorCreateInput } from '../../prisma/generated/prisma/models';
import type { UserCreateInput } from '../../prisma/generated/prisma/models';
import { AppError } from '../../utils/AppError.ts';

const DEFAULT_CONSULTATION: CreateConsultation = {
  userId: 1,
  doctorId: 1,
  date: '2024-07-01T10:00:00Z',
  notes: 'Initial consultation notes',
};

const TEST_CONSULTATION: CreateConsultation = {
  userId: 1,
  doctorId: 1,
  date: '2024-07-02T10:00:00Z',
  notes: 'Follow-up consultation notes',
};

const DEFAULT_USER: UserCreateInput = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'hash123',
  phoneNumber: '99999999',
  cpf: '12345678900',
  birthDate: '1990-01-01',
};
const DEFAULT_DOCTOR: DoctorCreateInput = {
  firstName: 'Dr. Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  role: 'doctor' as 'doctor' | 'admin',
  password: 'hash456',
  phoneNumber: '88888888',
  speciality: 'Neurology',
  cpf: '09876543210',
  birthDate: '1985-05-05',
  crm: '654321',
};
let DEFAULT_CONSULTATION_ID: number;
let DEFAULT_USER_ID: number;
let DEFAULT_DOCTOR_ID: number;

beforeEach(async () => {
  await prisma.referral.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.doctor.deleteMany();

  DEFAULT_USER_ID = (await insertUser(DEFAULT_USER))!.id;
  DEFAULT_DOCTOR_ID = (await insertDoctor(DEFAULT_DOCTOR))!.id;
  DEFAULT_CONSULTATION_ID = (await insertConsultation({
    ...DEFAULT_CONSULTATION,
    userId: DEFAULT_USER_ID,
    doctorId: DEFAULT_DOCTOR_ID,
  }))!.id;
});

describe('consultation Model Tests', () => {
  it('insertconsultation → Should insert and return an id', async () => {
    const result = await insertConsultation({
      ...TEST_CONSULTATION,
      userId: DEFAULT_USER_ID,
      doctorId: DEFAULT_DOCTOR_ID,
    });
    expect(result).toHaveProperty('id');
    expect(typeof result!.id).toBe('number');
  });

  it('insertconsultation → Should throw AppError for non-existing userId', async () => {
    expect(
      insertConsultation({
        ...TEST_CONSULTATION,
        userId: 9999,
        doctorId: DEFAULT_DOCTOR_ID,
      })
    ).rejects.toThrow(AppError);
  });

  it('insertconsultation → Should throw AppError for non-existing doctorId', async () => {
    expect(
      insertConsultation({
        ...TEST_CONSULTATION,
        userId: DEFAULT_USER_ID,
        doctorId: 9999,
      })
    ).rejects.toThrow(AppError);
  });

  it('selectconsultationById → Should return a consultation', async () => {
    const consultation = await selectConsultationById(DEFAULT_CONSULTATION_ID);

    expect(consultation).not.toBeNull();
    expect(consultation?.id).toBe(DEFAULT_CONSULTATION_ID);
  });

  it('selectconsultationById → Should return null for non-existing id', async () => {
    const consultation = await selectConsultationById(9999);

    expect(consultation).toBeNull();
  });

  it('selectUserConsultationsByUserId → Should return consultations for a user', async () => {
    const consultations = await selectUserConsultations(DEFAULT_USER_ID);
    expect(Array.isArray(consultations)).toBe(true);
    expect(consultations!.length).toBeGreaterThan(0);
  });

  it('selectUserConsultationsByUserId → Should return [] for non-existing userId', async () => {
    const consultations = await selectUserConsultations(9999);
    expect(consultations).toEqual([]);
  });

  it('selectDoctorConsultationsByDoctorId → Should return consultations for a doctor', async () => {
    const consultations = await selectDoctorConsultations(DEFAULT_DOCTOR_ID);
    expect(Array.isArray(consultations)).toBe(true);
    expect(consultations!.length).toBeGreaterThan(0);
  });

  it('selectDoctorConsultationsByDoctorId → Should return [] for non-existing doctorId', async () => {
    const consultations = await selectDoctorConsultations(9999);
    expect(consultations).toEqual([]);
  });
});
