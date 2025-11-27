import { describe, it, beforeEach, expect } from 'bun:test';
import { pool } from '../db/connection.ts';
import { insertReferral, selectReferralById } from './models';
import { insertConsultation } from '../consultations/models.ts';
import { insertUser } from '../users/models.ts';
import { insertDoctor } from '../doctors/models.ts';
import type { InsertReferral } from './types';

const DEFAULT_USER = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@example.com',
  passwordHash: 'password123',
  phoneNumber: '+1234567890',
  cpf: '12345678900',
  birthDate: '1990-01-01',
};

const DEFAULT_DOCTOR = {
  firstName: 'Test',
  lastName: 'Doctor',
  email: 'testdoctor@example.com',
  passwordHash: 'password123',
  phoneNumber: '+1234567890',
  role: 'doctor' as 'doctor' | 'admin',
  speciality: 'General',
  crm: 'CRM123456',
};

const DEFAULT_CONSULTATION = {
  userId: 1,
  doctorId: 1,
  consultationDate: new Date().toISOString(),
  notes: 'Initial consultation notes',
};
const DEFAULT_REFERRAL: InsertReferral = {
  consultationId: 1,
  notes: 'Initial Referral notes',
};

let DEFAULT_REFERRAL_ID: number;
let DEFAULT_CONSULTATION_ID: number;

beforeEach(async () => {
  await pool.query(`
    TRUNCATE TABLE 
      referrals,
      consultations,
      users,
      doctors
    RESTART IDENTITY CASCADE
  `);
  await insertUser(DEFAULT_USER);
  await insertDoctor(DEFAULT_DOCTOR);
  DEFAULT_CONSULTATION_ID = (await insertConsultation(DEFAULT_CONSULTATION)).id;
  DEFAULT_REFERRAL_ID = (await insertReferral(DEFAULT_REFERRAL))!.id;
});

describe('Referral Model Tests', () => {
  it('insertReferral → Should insert and return an id correctly', async () => {
    const result = await insertReferral({
      consultationId: DEFAULT_CONSULTATION_ID,
      notes: 'Referral for further tests',
    });
    expect(result).toHaveProperty('id');
    expect(typeof result!.id).toBe('number');
  });

  it('insertReferral → Should return null for invalid consultationId', async () => {
    expect(
      insertReferral({
        consultationId: 9999,
        notes: 'Referral with invalid consultationId',
      })
    ).resolves.toBeNull();
  });

  it('selectReferralById → Should return a Referral', async () => {
    const Referral = await selectReferralById(DEFAULT_REFERRAL_ID);

    expect(Referral).not.toBeNull();
    expect(Referral?.id).toBe(DEFAULT_REFERRAL_ID);
  });

  it('selectReferralById → Should return null for non-existing id', async () => {
    const Referral = await selectReferralById(9999);
    expect(Referral).toBeNull();
  });
});
