import { describe, it, beforeEach, expect } from 'bun:test';
import * as ref from './models';
import { insertConsultation } from '../consultations/repository.ts';
import { insertUser } from '../users/models.ts';
import { insertDoctor } from '../doctors/models.ts';
import { AppError } from '../../utils/AppError.ts';
import { prisma } from '../../prisma/client.ts';
import * as t from './types.ts';

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
    location: 'Room 101',
    status: 'scheduled',
    type: 'routine',
    endTime: new Date('2024-07-01T11:00:00Z'),
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

  it('selectAllReferrals → Should not return deleted referrals', async () => {
    await ref.softDeleteReferral(DEFAULT_REFERRAL_ID);
    const list = await ref.selectAllReferrals();
    expect(list.every((r) => r.id !== DEFAULT_REFERRAL_ID)).toBe(true);
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
    await expect(ref.updateReferralStatus(999999, 'completed')).rejects.toThrow(AppError);
  });

  it('updateReferralStatus → Should allow all valid statuses', async () => {
    const statuses = ['pending', 'cancelled', 'completed'] as const;

    for (const status of statuses) {
      const updated = await ref.updateReferralStatus(DEFAULT_REFERRAL_ID, status);
      expect(updated.status).toBe(status);
    }
  });
  it('softDeleteReferralsByConsultationId → should soft delete referrals', async () => {
    const deleted = await ref.softDeleteReferralsByConsultationId(DEFAULT_CONSULTATION_ID);
    expect(deleted.length).toBeGreaterThan(0);

    const referral = await ref.selectReferralById(DEFAULT_REFERRAL_ID);
    expect(referral?.deletedAt).not.toBeNull();
  });

  it('restoreReferral → should restore a deleted referral', async () => {
    await ref.softDeleteReferralsByConsultationId(DEFAULT_CONSULTATION_ID);
    const restored = await ref.restoreReferral(DEFAULT_REFERRAL_ID);
    expect(restored.deletedAt).toBeNull();
  });

  it('restoreReferral → should throw AppError for non-existing id', async () => {
    await expect(ref.restoreReferral(9999)).rejects.toThrow(AppError);
  });

  it('updateReferralNotes → should update referral notes', async () => {
    const newNotes = 'Updated notes';
    const updated = await ref.updateReferralNotes(DEFAULT_REFERRAL_ID, newNotes);
    expect(updated.notes).toBe(newNotes);
  });

  it('updateReferralNotes → should throw AppError for non-existing id', async () => {
    await expect(ref.updateReferralNotes(9999, 'New notes')).rejects.toThrow(AppError);
  });

  it('updateReferralStatus → should change the status of a referral', async () => {
    const newStatus: t.ReferralStatus = 'completed';
    const updated = await ref.updateReferralStatus(DEFAULT_REFERRAL_ID, newStatus);
    expect(updated.status).toBe(newStatus);
  });

  it('bulkUpdateReferralStatus → should update multiple referrals status', async () => {
    const referral2 = await ref.insertReferral({
      consultationId: DEFAULT_CONSULTATION_ID,
      userId: DEFAULT_USER_ID,
      referredById: DEFAULT_DOCTOR_ID,
      referredToId: DEFAULT_DOCTOR_ID,
      reason: 'Second referral',
      notes: 'Second referral notes',
    });

    const updated = await ref.bulkUpdateReferralStatus(
      [DEFAULT_REFERRAL_ID, referral2.id],
      'cancelled'
    );

    expect(updated.every((r) => r.status === 'cancelled')).toBe(true);
  });

  it('bulkUpdateReferralStatus → should throw AppError for invalid referral IDs', async () => {
    await expect(ref.bulkUpdateReferralStatus([9999], 'cancelled')).rejects.toThrow(AppError);
  });

  it('countReferralsByStatus → should return counts grouped by status', async () => {
    await ref.updateReferralStatus(DEFAULT_REFERRAL_ID, 'completed');
    const counts = await ref.countReferralsByStatus();

    expect(counts.completed).toBeGreaterThanOrEqual(1);
    expect(counts.pending).toBeGreaterThanOrEqual(0);
    expect(counts.cancelled).toBeGreaterThanOrEqual(0);
  });

  it('countReferralsByStatus → should return zero counts when no referrals exist', async () => {
    await prisma.referral.deleteMany();
    const counts = await ref.countReferralsByStatus();

    expect(counts.completed).toBe(0);
    expect(counts.pending).toBe(0);
    expect(counts.cancelled).toBe(0);
  });

  it('selectReferralsByStatus → should return referrals matching status', async () => {
    const referrals = await ref.selectReferralsByStatus('pending');
    expect(Array.isArray(referrals)).toBe(true);
    referrals.forEach((referral) => {
      expect(referral.status).toBe('pending');
    });
  });

  it('selectReferralsByStatus → should return empty array when no referrals match status', async () => {
    await prisma.referral.deleteMany({ where: { status: 'cancelled' } });
    const referrals = await ref.selectReferralsByStatus('cancelled');
    expect(referrals).toEqual([]);
  });

  it('selectDeletedReferrals → should return soft-deleted referrals', async () => {
    await ref.softDeleteReferral(DEFAULT_REFERRAL_ID);
    const deletedReferrals = await ref.selectDeletedReferrals();
    expect(Array.isArray(deletedReferrals)).toBe(true);
    deletedReferrals.forEach((referral) => {
      expect(referral.deletedAt).not.toBeNull();
    });
  });

  it('selectDeletedReferrals → should return empty array when no referrals are deleted', async () => {
    const deletedReferrals = await ref.selectDeletedReferrals();
    expect(deletedReferrals).toEqual([]);
  });
});
