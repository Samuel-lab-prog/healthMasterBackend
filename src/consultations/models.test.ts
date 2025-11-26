import { describe, it, beforeEach, expect } from 'bun:test';
import { pool } from '../db/connection.ts';

import { insertConsultation, selectConsultationById } from './models';

import type { InsertConsultation } from './types';
import { insertDoctor } from '../doctors/models.ts';
import { insertUser } from '../users/models.ts';

const DEFAULT_CONSULTATION: InsertConsultation = {
  userId: 1,
  doctorId: 1,
  consultationDate: new Date().toISOString(),
  notes: 'Initial consultation notes',
};
const DEFAULT_USER = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  passwordHash: 'hash123',
  phoneNumber: '99999999',
  speciality: 'Cardiology',
  crm: '123456',
};
const DEFAULT_DOCTOR = {
  firstName: 'Dr. Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  passwordHash: 'hash456',
  phoneNumber: '88888888',
  speciality: 'Neurology',
  crm: '654321',
};
let DEFAULT_CONSULTATION_ID: number;
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
  DEFAULT_CONSULTATION_ID = (
    await insertConsultation({
      ...DEFAULT_CONSULTATION,
      userId: DEFAULT_USER_ID,
      doctorId: DEFAULT_DOCTOR_ID,
    })
  ).id;
});

describe('Consultation Model Tests', () => {
  it('insertConsultation → Should insert and return an id', async () => {
    const result = await insertConsultation({
      userId: DEFAULT_USER_ID,
      doctorId: DEFAULT_DOCTOR_ID,
      consultationDate: new Date().toISOString(),
      notes: 'Follow-up consultation notes',
    });
    expect(result).toHaveProperty('id');
    expect(typeof result.id).toBe('number');
  });

  it('selectConsultationById → Should return a Consultation', async () => {
    const Consultation = await selectConsultationById(DEFAULT_CONSULTATION_ID);

    expect(Consultation).not.toBeNull();
    expect(Consultation?.id).toBe(DEFAULT_CONSULTATION_ID);
  });

  it('selectConsultationById → Should return null for non-existing id', async () => {
    const Consultation = await selectConsultationById(9999);
    expect(Consultation).toBeNull();
  });
});
