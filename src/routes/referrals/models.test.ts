import { describe, it, beforeEach, expect } from 'bun:test';
import * as ref from './models';
import { insertConsultation } from '../consultations/models.ts';
import { insertUser } from '../users/models.ts';
import { insertDoctor } from '../doctors/models.ts';
import type { CreateReferral } from './types';
import { AppError } from '../../utils/AppError.ts';
import { prisma } from '../../prisma/client.ts';

const DEFAULT_USER = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@example.com',
  password: 'password123',
  phoneNumber: '+1234567890',
  cpf: '12345678900',
  birthDate: '1990-01-01',
};

const DEFAULT_DOCTOR = {
  firstName: 'Test',
  lastName: 'Doctor',
  email: 'testdoctor@example.com',
  password: 'password123',
  phoneNumber: '+1234567890',
  cpf: '09876543210',
  birthDate: '1980-01-01',
  role: 'doctor' as 'doctor' | 'admin',
  speciality: 'General',
  crm: 'CRM123456',
};

const DEFAULT_CONSULTATION = {
  userId: 1,
  doctorId: 1,
  date: '2024-07-01T10:00:00Z',
  notes: 'Initial consultation notes',
};
const DEFAULT_REFERRAL: CreateReferral = {
  consultationId: 1,
  notes: 'Initial Referral notes',
};

let DEFAULT_USER_ID: number;
let DEFAULT_DOCTOR_ID: number;
let DEFAULT_REFERRAL_ID: number;
let DEFAULT_CONSULTATION_ID: number;

beforeEach(async () => {
  await prisma.referral.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.doctor.deleteMany();

  DEFAULT_USER_ID = (await insertUser(DEFAULT_USER))!.id;
  DEFAULT_DOCTOR_ID = (await insertDoctor(DEFAULT_DOCTOR))!.id;

  DEFAULT_CONSULTATION.userId = DEFAULT_USER_ID;
  DEFAULT_CONSULTATION.doctorId = DEFAULT_DOCTOR_ID;
  DEFAULT_CONSULTATION_ID = (await insertConsultation(DEFAULT_CONSULTATION))!.id;
  DEFAULT_REFERRAL.consultationId = DEFAULT_CONSULTATION_ID;
  DEFAULT_REFERRAL_ID = (await ref.insertReferral(DEFAULT_REFERRAL))!.id;
});

describe('Referral Model Tests', () => {
  it('insertReferral → Should insert and return an id correctly', async () => {
    const result = await ref.insertReferral({
      consultationId: DEFAULT_CONSULTATION_ID,
      notes: 'Referral for further tests',
    });
    expect(result).toHaveProperty('id');
    expect(typeof result!.id).toBe('number');
  });

  it('insertReferral → Should return null for invalid consultationId', async () => {
    expect(
      ref.insertReferral({
        consultationId: 9999,
        notes: 'Referral with invalid consultationId',
      })
    ).rejects.toThrow(AppError);
  });

  it('selectReferralById → Should return a Referral', async () => {
    const referral = await ref.selectReferralById(DEFAULT_REFERRAL_ID);

    expect(referral).not.toBeNull();
    expect(referral?.id).toBe(DEFAULT_REFERRAL_ID);
  });

  it('selectReferralById → Should return null for non-existing id', async () => {
    const referral = await ref.selectReferralById(9999);
    expect(referral).toBeNull();
  });

  it('selectReferralsByUserId → Should return Referrals for a User', async () => {
    const referrals = await ref.selectUserReferrals(DEFAULT_USER_ID);
    expect(referrals).not.toBeNull();
    expect(referrals!.length).toBeGreaterThan(0);
  });

  it('selectReferralsByUserId → Should return [] for non-existing User ID or empty referrals', async () => {
    const referrals = await ref.selectUserReferrals(9999);
    expect(referrals).toEqual([]);
  });

  it('selectAllReferrals → Should return all Referrals', async () => {
    const referrals = await ref.selectAllReferrals();
    expect(referrals!.length).toBeGreaterThan(0);
  });

  it('selectAllReferrals → Should return [] if no referrals exist', async () => {
    await prisma.referral.deleteMany();
    const referrals = await ref.selectAllReferrals();
    expect(referrals).toEqual([]);
  });

  it('selectDoctorReferrals → Should return Referrals for a Doctor', async () => {
    const referrals = await ref.selectDoctorReferrals(DEFAULT_DOCTOR_ID);
    expect(referrals).not.toBeNull();
    expect(referrals!.length).toBeGreaterThan(0);
  });

  it('selectDoctorReferrals → Should return [] for non-existing Doctor ID or empty referrals', async () => {
    const referrals = await ref.selectDoctorReferrals(9999);
    expect(referrals).toEqual([]);
  });

  it('selectReferralsByConsultationId→ Should return Referrals for a Consultation', async () => {
    const referrals = await ref.selectReferralsByConsultationId(DEFAULT_CONSULTATION_ID);
    expect(referrals).not.toBeNull();
    expect(referrals!.length).toBeGreaterThan(0);
  });

  it('selectReferralsByConsultationId → Should return [] for non-existing Consultation ID or empty referrals', async () => {
    const referrals = await ref.selectReferralsByConsultationId(9999);
    expect(referrals).toEqual([]);
  });

  it('selectUserReferrals → Should return Referrals for a User', async () => {
    const referrals = await ref.selectUserReferrals(DEFAULT_USER_ID);
    expect(referrals).not.toBeNull();
    expect(referrals!.length).toBeGreaterThan(0);
  });

  it('selectUserReferralsByUserId → Should return [] for non-existing User ID or empty referrals', async () => {
    const referrals = await ref.selectUserReferrals(9999);
    expect(referrals).toEqual([]);
  });
});
