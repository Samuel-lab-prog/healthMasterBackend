import { describe, it, beforeEach, expect } from 'bun:test';
import * as ref from './models';
import { insertConsultation } from '../consultations/models.ts';
import { insertUser } from '../users/models.ts';
import { insertDoctor } from '../doctors/models.ts';
import { AppError } from '../../utils/AppError.ts';
import { prisma } from '../../prisma/client.ts';

const DEFAULT_USER = {
  firstName: 'Test',
  lastName: 'User',
  email: `user_${Date.now()}@mail.com`,
  password: 'password123',
  phoneNumber: `+10000000${Math.floor(Math.random() * 9999)}`,
  cpf: `${Math.floor(Math.random() * 10 ** 11)}`.padStart(11, '0'),
  birthDate: new Date('1990-01-01'),
};

const DEFAULT_DOCTOR = {
  firstName: 'Test',
  lastName: 'Doctor',
  email: `doctor_${Date.now()}@mail.com`,
  password: 'password123',
  phoneNumber: `+20000000${Math.floor(Math.random() * 9999)}`,
  cpf: `${Math.floor(Math.random() * 10 ** 11)}`.padStart(11, '0'),
  birthDate: new Date('1980-01-01'),
  role: 'doctor' as const,
  speciality: 'General',
  crm: `CRM${Math.floor(Math.random() * 999999)}`,
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

  const consultation = await insertConsultation({
    userId: DEFAULT_USER_ID,
    doctorId: DEFAULT_DOCTOR_ID,
    date: '2024-07-01T10:00:00Z',
    notes: 'Initial consultation notes',
  });

  DEFAULT_CONSULTATION_ID = consultation!.id;

  const referral = await ref.insertReferral({
    consultationId: DEFAULT_CONSULTATION_ID,
    userId: DEFAULT_USER_ID,
    referredById: DEFAULT_DOCTOR_ID,
    referredToId: DEFAULT_DOCTOR_ID,
    reason: 'Routine test',
    notes: 'Initial Referral notes',
  });

  DEFAULT_REFERRAL_ID = referral!.id;
});

describe('Referral Model Tests', () => {
  it('insertReferral → Should insert and return an id', async () => {
    const result = await ref.insertReferral({
      consultationId: DEFAULT_CONSULTATION_ID,
      userId: DEFAULT_USER_ID,
      referredById: DEFAULT_DOCTOR_ID,
      referredToId: DEFAULT_DOCTOR_ID,
      reason: 'Follow-up',
      notes: 'Referral for further tests',
    });

    expect(result).toHaveProperty('id');
  });

  it('insertReferral → Should throw AppError for invalid consultationId', async () => {
    await expect(
      ref.insertReferral({
        consultationId: 999999,
        userId: DEFAULT_USER_ID,
        referredById: DEFAULT_DOCTOR_ID,
        referredToId: DEFAULT_DOCTOR_ID,
        reason: 'Invalid test',
        notes: 'Invalid',
      })
    ).rejects.toThrow(AppError);
  });

  it('selectReferralById → Should return a Referral', async () => {
    const referral = await ref.selectReferralById(DEFAULT_REFERRAL_ID);
    expect(referral?.id).toBe(DEFAULT_REFERRAL_ID);
  });

  it('selectReferralById → Should return null for non-existing id', async () => {
    expect(await ref.selectReferralById(999999)).toBeNull();
  });

  it('selectUserReferrals → Should list referrals for a user', async () => {
    const list = await ref.selectUserReferrals(DEFAULT_USER_ID);
    expect(list.length).toBeGreaterThan(0);
  });

  it('selectUserReferrals → Should return empty array for user with no referrals', async () => {
    expect(await ref.selectUserReferrals(999999)).toEqual([]);
  });

  it('selectAllReferrals → Should return all referrals', async () => {
    const list = await ref.selectAllReferrals();
    expect(list.length).toBeGreaterThan(0);
  });

  it('selectAllReferrals → Should return empty array when none exist', async () => {
    await prisma.referral.deleteMany();
    expect(await ref.selectAllReferrals()).toEqual([]);
  });

  it('selectDoctorReferrals → Should list referrals for a doctor', async () => {
    const list = await ref.selectDoctorReferrals(DEFAULT_DOCTOR_ID);
    expect(list.length).toBeGreaterThan(0);
  });

  it('selectDoctorReferrals → Should return empty array for non-existing doctor', async () => {
    expect(await ref.selectDoctorReferrals(999999)).toEqual([]);
  });

  it('selectReferralsByConsultationId → Should list referrals linked to a consultation', async () => {
    const list = await ref.selectReferralsByConsultationId(DEFAULT_CONSULTATION_ID);
    expect(list.length).toBeGreaterThan(0);
  });

  it('selectReferralsByConsultationId → Should return empty array for invalid consultation', async () => {
    expect(await ref.selectReferralsByConsultationId(999999)).toEqual([]);
  });

  it('softDeleteReferral → Should soft delete a referral', async () => {
    const result = await ref.softDeleteReferral(DEFAULT_REFERRAL_ID);

    expect(result).toHaveProperty('id', DEFAULT_REFERRAL_ID);

    const deleted = await prisma.referral.findUnique({
      where: { id: DEFAULT_REFERRAL_ID },
    });

    expect(deleted?.deletedAt).not.toBeNull();
  });

  it('softDeleteReferral → Should throw AppError for invalid referral id', async () => {
    await expect(ref.softDeleteReferral(999999)).rejects.toThrow(AppError);
  });

  it('updateReferralStatus → Should update referral status successfully', async () => {
    const updated = await ref.updateReferralStatus(DEFAULT_REFERRAL_ID, 'completed');

    expect(updated.id).toBe(DEFAULT_REFERRAL_ID);
    expect(updated.status).toBe('completed');
  });

  it('updateReferralStatus → Should throw AppError for invalid referral id', async () => {
    await expect(
      ref.updateReferralStatus(999999, 'completed')
    ).rejects.toThrow(AppError);
  });

  it('updateReferralStatus → Should allow all valid statuses', async () => {
    const statuses = ['pending', 'cancelled', 'completed'] as const;

    for (const status of statuses) {
      const updated = await ref.updateReferralStatus(DEFAULT_REFERRAL_ID, status);
      expect(updated.status).toBe(status);
    }
  });

});
