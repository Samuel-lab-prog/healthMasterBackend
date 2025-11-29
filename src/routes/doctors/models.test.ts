import { describe, it, beforeEach, expect } from 'bun:test';
import { pool } from '../../db/connection.ts';

import {
  insertDoctor,
  selectDoctorByField,
  selectAllDoctors,
} from './models';

import type { InsertDoctor } from './types';
import { AppError } from '../../utils/AppError.ts';

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

  it('insertDoctor → Should throw AppError for duplicated CPF', async () => {
    expect(insertDoctor({ ...TEST_DOCTOR, cpf: DEFAULT_DOCTOR.cpf })).rejects.toThrow(AppError);
  });

  it('insertDoctor → Should throw AppError for duplicated CRM', async () => {
    expect(insertDoctor({ ...TEST_DOCTOR, crm: DEFAULT_DOCTOR.crm })).rejects.toThrow(AppError);
  });

  it('insertDoctor → Should throw AppError for duplicated phone number', async () => {
    expect(
      insertDoctor({ ...TEST_DOCTOR, phoneNumber: DEFAULT_DOCTOR.phoneNumber! })
    ).rejects.toThrow(AppError);
  });

  it('selectDoctorByField → Should return a Doctor', async () => {
    const Doctor = await selectDoctorByField('id', DEFAULT_DOCTOR_ID);

    expect(Doctor).not.toBeNull();
    expect(Doctor?.id).toBe(DEFAULT_DOCTOR_ID);
  });

  it('selectDoctorByField → Should throw AppError for non-existing id', async () => {
    await expect(selectDoctorByField('id', 9999)).rejects.toThrow(AppError);
  });

  it('selectDoctorByField → Should return a Doctor', async () => {
    const Doctor = await selectDoctorByField('email', DEFAULT_DOCTOR.email);

    expect(Doctor).not.toBeNull();
    expect(Doctor?.email).toBe(DEFAULT_DOCTOR.email);
  });

  it('selectDoctorByField → Should throw AppError for non-existing email', async () => {
    await expect(selectDoctorByField('email', 'nope@example.com')).rejects.toThrow(AppError);
  });

  it('selectDoctorByField → Should return a Doctor', async () => {
    const Doctor = await selectDoctorByField('phone_number', DEFAULT_DOCTOR.phoneNumber!);
    expect(Doctor).not.toBeNull();
    expect(Doctor?.phoneNumber).toBe(DEFAULT_DOCTOR.phoneNumber);
  });

  it('selectDoctorByField → Should throw AppError for non-existing phone', async () => {
    await expect(selectDoctorByField('phone_number', 'not-a-phone')).rejects.toThrow(AppError);
  });

  it('selectDoctorByField → Should return a Doctor', async () => {
    const Doctor = await selectDoctorByField('crm', DEFAULT_DOCTOR.crm);
    expect(Doctor).not.toBeNull();
    expect(Doctor?.crm).toBe(DEFAULT_DOCTOR.crm);
  });

  it('selectDoctorByField → Should throw AppError for non-existing CRM', async () => {
    await expect(selectDoctorByField('crm', 'no-crm')).rejects.toThrow(AppError);
  });

  it('selectDoctorByField → Should return a Doctor', async () => {
    const Doctor = await selectDoctorByField('cpf', DEFAULT_DOCTOR.cpf);
    expect(Doctor).not.toBeNull();
    expect(Doctor?.cpf).toBe(DEFAULT_DOCTOR.cpf);
  });

  it('selectDoctorByField → Should throw AppError for non-existing CPF', async () => {
    await expect(selectDoctorByField('cpf', '000.000.000-00')).rejects.toThrow(AppError);
  });

  it('selectAllDoctors → Should return all Doctors', async () => {
    await insertDoctor(TEST_DOCTOR);
    const doctors = await selectAllDoctors();
    expect(doctors!.length).toBe(2);
  });

  it('selectAllDoctors → Should return [] when no Doctors', async () => {
    await pool.query('DELETE FROM doctors');
    const doctors = await selectAllDoctors();
    expect(doctors).toEqual([]);
  });
});
