import { describe, it, beforeEach, expect } from 'bun:test';
import { pool } from '../db/connection.ts';

import {
  insertDoctor,
  selectDoctorByEmail,
  selectDoctorById,
  selectDoctorByPhoneNumber,
  selectDoctorByCRM,
  selectDoctorByCPF,
  selectAllDoctors,
} from './models';

import type { InsertDoctor } from './types';
import { AppError } from '../utils/AppError.ts';

const DEFAULT_DOCTOR: InsertDoctor = {
  firstName: 'John',
  lastName: 'Doe',
  cpf: '123.456.789-00',
  birthDate: '1980-01-01',
  email: 'john@example.com',
  role: 'doctor',
  passwordHash: 'hash123',
  phoneNumber: '99999999',
  speciality: 'Cardiology',
  crm: '123456',
};

const TEST_DOCTOR: InsertDoctor = {
  firstName: 'Jane',
  lastName: 'Doe',
  cpf: '987.654.321-00',
  birthDate: '1990-02-02',
  email: 'jane@example.com',
  role: 'doctor',
  passwordHash: 'hash456',
  phoneNumber: '88888888',
  speciality: 'Neurology',
  crm: '654321',
};

let DEFAULT_DOCTOR_ID: number;

beforeEach(async () => {
  await pool.query('DELETE FROM referrals');
  await pool.query('DELETE FROM consultations');
  await pool.query('DELETE FROM doctors');
  DEFAULT_DOCTOR_ID = (await insertDoctor(DEFAULT_DOCTOR))!.id;
});

describe('Doctor Model Tests', () => {
  it('insertDoctor → Should insert and return an id', async () => {
    const result = await insertDoctor(TEST_DOCTOR);

    expect(result).toHaveProperty('id');
    expect(typeof result!.id).toBe('number');
  });

  it('insertDoctor → Should throw AppError for duplicated email', async () => {
    expect(insertDoctor({ ...TEST_DOCTOR, email: DEFAULT_DOCTOR.email })).rejects.toThrow(AppError);
  });

  it('insertDoctor → Should throw AppError for duplicated phone number', async () => {
    expect(
      insertDoctor({ ...TEST_DOCTOR, phoneNumber: DEFAULT_DOCTOR.phoneNumber! })
    ).rejects.toThrow(AppError);
  });

  it('selectDoctorById → Should return a Doctor', async () => {
    const Doctor = await selectDoctorById(DEFAULT_DOCTOR_ID);

    expect(Doctor).not.toBeNull();
    expect(Doctor?.id).toBe(DEFAULT_DOCTOR_ID);
  });

  it('selectDoctorById → Should return null for non-existing id', async () => {
    const Doctor = await selectDoctorById(9999);
    expect(Doctor).toBeNull();
  });

  it('selectDoctorByEmail → Should return a Doctor', async () => {
    const Doctor = await selectDoctorByEmail(DEFAULT_DOCTOR.email);

    expect(Doctor).not.toBeNull();
    expect(Doctor?.email).toBe(DEFAULT_DOCTOR.email);
  });

  it('selectDoctorByEmail → Should return null for non-existing email', async () => {
    const Doctor = await selectDoctorByEmail('nope@example.com');
    expect(Doctor).toBeNull();
  });

  it('selectDoctorByPhoneNumber → Should return a Doctor', async () => {
    const Doctor = await selectDoctorByPhoneNumber(DEFAULT_DOCTOR.phoneNumber!);
    expect(Doctor).not.toBeNull();
    expect(Doctor?.phoneNumber).toBe(DEFAULT_DOCTOR.phoneNumber);
  });

  it('selectDoctorByPhoneNumber → Should return null for non-existing phone', async () => {
    const Doctor = await selectDoctorByPhoneNumber('not-a-phone');
    expect(Doctor).toBeNull();
  });

  it('selectDoctorByCRM → Should return a Doctor', async () => {
    const Doctor = await selectDoctorByCRM(DEFAULT_DOCTOR.crm);
    expect(Doctor).not.toBeNull();
    expect(Doctor?.crm).toBe(DEFAULT_DOCTOR.crm);
  });

  it('selectDoctorByCRM → Should return null for non-existing CRM', async () => {
    const Doctor = await selectDoctorByCRM('no-crm');
    expect(Doctor).toBeNull();
  });

  it('selectDoctorByCPF → Should return a Doctor', async () => {
    const Doctor = await selectDoctorByCPF(DEFAULT_DOCTOR.cpf);
    expect(Doctor).not.toBeNull();
    expect(Doctor?.cpf).toBe(DEFAULT_DOCTOR.cpf);
  });

  it('selectDoctorByCPF → Should return null for non-existing CPF', async () => {
    const Doctor = await selectDoctorByCPF('000.000.000-00');
    expect(Doctor).toBeNull();
  });

  it('selectAllDoctors → Should return all Doctors', async () => {
    await insertDoctor(TEST_DOCTOR);
    const doctors = await selectAllDoctors();
    expect(doctors!.length).toBe(2);
  });

  it('selectAllDoctors → Should return null when no Doctors', async () => {
    await pool.query('DELETE FROM doctors');
    const doctors = await selectAllDoctors();
    expect(doctors).toBeNull();
  });
});
