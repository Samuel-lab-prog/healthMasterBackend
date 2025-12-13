import { describe, it, beforeEach, expect } from 'bun:test';
import { prisma } from '../../prisma/client.ts';

import * as r from './repository.ts';
import type { InsertConsultation } from './types.ts';

import type { InsertUser } from '../users/types.ts';
import { insertUser } from '../users/models.ts';

import type { InsertDoctor } from '../doctors/types.ts';
import { insertDoctor } from '../doctors/models.ts';

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

let USER_ID: number;
let DOCTOR_ID: number;
let CONSULTATION_ID: number;

beforeEach(async () => {
  await prisma.referral.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.doctor.deleteMany();

  USER_ID = (await insertUser(DEFAULT_USER))!.id;
  DOCTOR_ID = (await insertDoctor(DEFAULT_DOCTOR))!.id;

  CONSULTATION_ID = (
    await r.insertConsultation({
      ...DEFAULT_CONSULTATION,
      userId: USER_ID,
      doctorId: DOCTOR_ID,
    })
  ).id;
});

describe('Consultation Repository', () => {
  it('insertConsultation → returns id', async () => {
    const result = await r.insertConsultation({
      ...DEFAULT_CONSULTATION,
      userId: USER_ID,
      doctorId: DOCTOR_ID,
    });

    expect(result.id).toBeTypeOf('number');
  });

  it('insertConsultation → throws AppError on invalid FK', async () => {
    await expect(
      r.insertConsultation({
        ...DEFAULT_CONSULTATION,
        userId: 9999,
        doctorId: DOCTOR_ID,
      })
    ).rejects.toThrow(AppError);
  });

  it('selectConsultationById → returns consultation', async () => {
    const consultation = await r.selectConsultationById(CONSULTATION_ID);
    expect(consultation).not.toBeNull();
    expect(consultation!.id).toBe(CONSULTATION_ID);
  });

  it('selectConsultationById → returns null if not found', async () => {
    const consultation = await r.selectConsultationById(9999);
    expect(consultation).toBeNull();
  });

  it('selectConsultationsByUserId → returns user consultations', async () => {
    const consultations = await r.selectConsultationsByUserId(USER_ID);
    expect(consultations.length).toBeGreaterThan(0);
  });

  it('selectConsultationsByDoctorId → returns doctor consultations', async () => {
    const consultations = await r.selectConsultationsByDoctorId(DOCTOR_ID);
    expect(consultations.length).toBeGreaterThan(0);
  });

  it('softDeleteConsultation → hides consultation from active queries', async () => {
    await r.softDeleteConsultation(CONSULTATION_ID);

    const active = await r.selectConsultationById(CONSULTATION_ID);
    expect(active).toBeNull();

    const deleted = await r.selectDeletedConsultationById(CONSULTATION_ID);
    expect(deleted).not.toBeNull();
    expect(deleted!.deletedAt).not.toBeNull();
  });

  it('selectAllDeletedConsultations → returns only deleted consultations', async () => {
    await r.softDeleteConsultation(CONSULTATION_ID);

    const deleted = await r.selectAllDeletedConsultations();
    expect(deleted.length).toBe(1);
    expect(deleted[0]!.deletedAt).not.toBeNull();
  });

  it('updateConsultationStatus → updates status', async () => {
    const updated = await r.updateConsultationStatus(
      CONSULTATION_ID,
      'completed'
    );

    expect(updated.status).toBe('completed');
  });

  it('updateConsultationNotes → updates notes', async () => {
    const updated = await r.updateConsultationNotes(
      CONSULTATION_ID,
      'Updated notes'
    );

    expect(updated.notes).toBe('Updated notes');
  });

  it('updateConsultationStatus → throws AppError if not found', async () => {
    await expect(
      r.updateConsultationStatus(9999, 'completed')
    ).rejects.toThrow(AppError);
  });
});
