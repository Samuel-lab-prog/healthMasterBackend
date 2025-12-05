import { describe, it, beforeEach, expect } from 'bun:test';
import { prisma } from '../../prisma/client.ts';
import * as m from './models.ts';
import type { InsertConsultation } from './types.ts';
import type { InsertUser } from '../users/types.ts';
import type { InsertDoctor } from '../doctors/types.ts';
import { insertDoctor } from '../doctors/models.ts';
import { insertUser } from '../users/models.ts';
import { AppError } from '../../utils/AppError.ts';

const DEFAULT_CONSULTATION: InsertConsultation = {
  userId: 1,
  doctorId: 1,
  date: '2024-07-01T10:00:00Z',
  notes: 'Initial consultation notes',
  location: 'Room 101',
  status: 'scheduled',
  type: 'routine',
  endTime: new Date('2024-07-01T11:00:00Z'),
};

const TEST_CONSULTATION: InsertConsultation = {
  userId: 1,
  doctorId: 1,
  date: '2024-07-02T10:00:00Z',
  notes: 'Follow-up consultation notes',
  location: 'Room 102',
  status: 'scheduled',
  type: 'exam',
  endTime: new Date('2024-07-02T11:00:00Z'),
};

const DEFAULT_USER: InsertUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'hash123',
  phoneNumber: '99999999',
  cpf: '12345678900',
  birthDate: new Date('1980-01-01'),
};

const DEFAULT_DOCTOR: InsertDoctor = {
  firstName: 'Dr. Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  role: 'doctor',
  password: 'hash456',
  phoneNumber: '88888888',
  speciality: 'Neurology',
  cpf: '09876543210',
  birthDate: new Date('1985-05-05'),
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

  DEFAULT_CONSULTATION_ID = (await m.insertConsultation({
    ...DEFAULT_CONSULTATION,
    userId: DEFAULT_USER_ID,
    doctorId: DEFAULT_DOCTOR_ID,
  }))!.id;
});

describe('consultation Model Tests', () => {
  it('insertConsultation → returns id when inserted', async () => {
    const result = await m.insertConsultation({
      ...TEST_CONSULTATION,
      userId: DEFAULT_USER_ID,
      doctorId: DEFAULT_DOCTOR_ID,
    });

    expect(result).toHaveProperty('id');
    expect(typeof result!.id).toBe('number');
  });

  it('insertConsultation → throws AppError on invalid userId', async () => {
    await expect(
      m.insertConsultation({
        ...TEST_CONSULTATION,
        userId: 9999,
        doctorId: DEFAULT_DOCTOR_ID,
      })
    ).rejects.toThrow(AppError);
  });

  it('insertConsultation → throws AppError on invalid doctorId', async () => {
    await expect(
      m.insertConsultation({
        ...TEST_CONSULTATION,
        userId: DEFAULT_USER_ID,
        doctorId: 9999,
      })
    ).rejects.toThrow(AppError);
  });

  it('selectConsultationById → returns consultation when found', async () => {
    const consultation = await m.selectConsultationById(DEFAULT_CONSULTATION_ID);
    expect(consultation).not.toBeNull();
    expect(consultation?.id).toBe(DEFAULT_CONSULTATION_ID);
  });

  it('selectConsultationById → returns null for non-existing id', async () => {
    const consultation = await m.selectConsultationById(9999);
    expect(consultation).toBeNull();
  });

  it('selectUserConsultations → returns consultations for user', async () => {
    const consultations = await m.selectUserConsultations(DEFAULT_USER_ID);
    expect(Array.isArray(consultations)).toBe(true);
    expect(consultations.length).toBeGreaterThan(0);
  });

  it('selectUserConsultations → empty array for unknown userId', async () => {
    const consultations = await m.selectUserConsultations(9999);
    expect(consultations).toEqual([]);
  });

  it('selectDoctorConsultations → returns consultations for doctor', async () => {
    const consultations = await m.selectDoctorConsultations(DEFAULT_DOCTOR_ID);
    expect(Array.isArray(consultations)).toBe(true);
    expect(consultations.length).toBeGreaterThan(0);
  });

  it('selectDoctorConsultations → empty array for unknown doctorId', async () => {
    const consultations = await m.selectDoctorConsultations(9999);
    expect(consultations).toEqual([]);
  });

  it('softDeleteConsultation → should soft delete a consultation', async () => {
    const result = await m.softDeleteConsultation(DEFAULT_CONSULTATION_ID);
    expect(result).toHaveProperty('id', DEFAULT_CONSULTATION_ID);

    const deleted = await m.selectConsultationById(DEFAULT_CONSULTATION_ID);
    expect(deleted?.deletedAt).not.toBeNull();
  });

  it('restoreConsultation → should restore a soft-deleted consultation', async () => {
    await m.softDeleteConsultation(DEFAULT_CONSULTATION_ID);

    const restored = await m.restoreConsultation(DEFAULT_CONSULTATION_ID);
    expect(restored.deletedAt).toBeNull();
  });

  it('updateConsultationStatus → should update the status', async () => {
    const updated = await m.updateConsultationStatus(DEFAULT_CONSULTATION_ID, 'completed');
    expect(updated.status).toBe('completed');

    const fetched = await m.selectConsultationById(DEFAULT_CONSULTATION_ID);
    expect(fetched?.status).toBe('completed');
  });

  it('updateConsultationNotes → should update consultation notes', async () => {
    const newNotes = 'Updated consultation notes';
    const updated = await m.updateConsultationNotes(DEFAULT_CONSULTATION_ID, newNotes);
    expect(updated.notes).toBe(newNotes);

    const fetched = await m.selectConsultationById(DEFAULT_CONSULTATION_ID);
    expect(fetched?.notes).toBe(newNotes);
  });

  it('countConsultationsByStatus → should return correct counts', async () => {
    const counts = await m.countConsultationsByStatus();
    expect(counts).toHaveProperty('scheduled');
    expect(counts).toHaveProperty('completed');
    expect(counts).toHaveProperty('cancelled');
    expect(counts).toHaveProperty('no_show');
    expect(typeof counts.scheduled).toBe('number');
  });
});
