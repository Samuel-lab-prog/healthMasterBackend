import { describe, it, beforeEach, expect } from 'bun:test';
import { pool } from '../db/connection.ts';

import { insertConsultation,
   selectConsultationById,
   selectUserConsultationsByUserId,
   selectDoctorConsultationsByDoctorId,
   } from './models';

import type { InsertConsultation } from './types';
import { insertDoctor } from '../doctors/models.ts';
import { insertUser } from '../users/models.ts';
import { AppError } from '../utils/AppError.ts';

const DEFAULT_consultation: InsertConsultation = {
  userId: 1,
  doctorId: 1,
  consultationDate: new Date(),
  notes: 'Initial consultation notes',
};

const TEST_consultation: InsertConsultation = {
  userId: 1,
  doctorId: 1,
  consultationDate: new Date(),
  notes: 'Follow-up consultation notes',
};

const DEFAULT_USER = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  passwordHash: 'hash123',
  phoneNumber: '99999999',
  speciality: 'Cardiology',
  crm: '123456',
  cpf: '12345678900',
  birthDate: '1990-01-01',
};
const DEFAULT_DOCTOR = {
  firstName: 'Dr. Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  role: 'doctor' as 'doctor' | 'admin',
  passwordHash: 'hash456',
  phoneNumber: '88888888',
  speciality: 'Neurology',
  cpf: '09876543210',
  birthDate: '1985-05-05',
  crm: '654321',
};
let DEFAULT_consultation_ID: number;
let DEFAULT_USER_ID: number;
let DEFAULT_DOCTOR_ID: number;

beforeEach(async () => {
  await pool.query(`
    TRUNCATE TABLE 
      referrals,
      consultations,
      users,
      doctors
    RESTART IDENTITY CASCADE
  `);

  DEFAULT_USER_ID = (await insertUser(DEFAULT_USER)).id;
  DEFAULT_DOCTOR_ID = (await insertDoctor(DEFAULT_DOCTOR)).id;
  DEFAULT_consultation_ID = (
    await insertConsultation({
      ...DEFAULT_consultation,
      userId: DEFAULT_USER_ID,
      doctorId: DEFAULT_DOCTOR_ID,
    })
  ).id;
});

describe('consultation Model Tests', () => {
  it('insertconsultation → Should insert and return an id', async () => {
    const result = await insertConsultation({
      ...TEST_consultation,
      userId: DEFAULT_USER_ID,
      doctorId: DEFAULT_DOCTOR_ID,
    });
    expect(result).toHaveProperty('id');
    expect(typeof result.id).toBe('number');
  });

  it('insertconsultation → Should throw AppError for non-existing userId', async () => {
     expect(
      insertConsultation({
        ...TEST_consultation,
        userId: 9999,
        doctorId: DEFAULT_DOCTOR_ID,
      })
    ).rejects.toThrow(AppError);
  });

  it('insertconsultation → Should throw AppError for non-existing doctorId', async () => {
     expect(
      insertConsultation({
        ...TEST_consultation,
        userId: DEFAULT_USER_ID,
        doctorId: 9999,
      })
    ).rejects.toThrow(AppError);
  });

  it('selectconsultationById → Should return a consultation', async () => {
    const consultation = await selectConsultationById(DEFAULT_consultation_ID);

    expect(consultation).not.toBeNull();
    expect(consultation?.id).toBe(DEFAULT_consultation_ID);
  });

  it('selectconsultationById → Should return null for non-existing id', async () => {
    const consultation = await selectConsultationById(9999);

    expect(consultation).toBeNull();
  });

  it('selectUserConsultationsByUserId → Should return consultations for a user', async () => {
    const consultations = await selectUserConsultationsByUserId(DEFAULT_USER_ID);
    expect(Array.isArray(consultations)).toBe(true);
    expect(consultations!.length).toBeGreaterThan(0);
  });

  it('selectUserConsultationsByUserId → Should return null for non-existing userId', async () => {
    const consultations = await selectUserConsultationsByUserId(9999);
    expect(consultations).toBeNull();
  });

  it('selectDoctorConsultationsByDoctorId → Should return consultations for a doctor', async () => {
    const consultations = await selectDoctorConsultationsByDoctorId(DEFAULT_DOCTOR_ID);
    expect(Array.isArray(consultations)).toBe(true);
    expect(consultations!.length).toBeGreaterThan(0);
  });

  it('selectDoctorConsultationsByDoctorId → Should return null for non-existing doctorId', async () => {
    const consultations = await selectDoctorConsultationsByDoctorId(9999);
    expect(consultations).toBeNull();
  });
});