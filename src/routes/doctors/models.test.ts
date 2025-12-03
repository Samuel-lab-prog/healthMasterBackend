import { describe, it, beforeEach, expect } from 'bun:test';
import { prisma } from '../../prisma/client.ts';
import { AppError } from '../../utils/AppError.ts';
import { insertDoctor, selectDoctorByField, selectAllDoctors, } from './models';
import type { InsertDoctor } from './types.ts';

const DEFAULT_DOCTOR: InsertDoctor = {
  firstName: 'John',
  lastName: 'Doe',
  cpf: '12345678900',
  birthDate: '1980-01-01',
  email: 'john@example.com',
  role: 'doctor',
  password: 'hash123',
  phoneNumber: '99999999',
  speciality: 'Cardiology',
  crm: '123456',
};

const TEST_DOCTOR: InsertDoctor = {
  firstName: 'Jane',
  lastName: 'Doe',
  cpf: '98765432100',
  birthDate: '1990-02-02',
  email: 'jane@example.com',
  role: 'doctor',
  password: 'hash456',
  phoneNumber: '88888888',
  speciality: 'Neurology',
  crm: '654321',
};

let DEFAULT_DOCTOR_ID: number;

beforeEach(async () => {
  await prisma.referral.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.doctor.deleteMany();

  DEFAULT_DOCTOR_ID = (await insertDoctor(DEFAULT_DOCTOR))!.id;
});

describe('Doctor Model Tests', () => {
  it('insertDoctor → Should insert and return an id', async () => {
    const result = await insertDoctor(TEST_DOCTOR);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('id');
    expect(typeof result!.id).toBe('number');
  });

  it('insertDoctor → Should throw AppError for duplicated email', async () => {
    await expect(insertDoctor({ ...TEST_DOCTOR, email: DEFAULT_DOCTOR.email })).rejects.toThrow(
      AppError
    );
  });

  it('insertDoctor → Should throw AppError for duplicated CPF', async () => {
    await expect(insertDoctor({ ...TEST_DOCTOR, cpf: DEFAULT_DOCTOR.cpf })).rejects.toThrow(
      AppError
    );
  });

  it('insertDoctor → Should throw AppError for duplicated CRM', async () => {
    await expect(insertDoctor({ ...TEST_DOCTOR, crm: DEFAULT_DOCTOR.crm })).rejects.toThrow(
      AppError
    );
  });

  it('insertDoctor → Should throw AppError for duplicated phone number', async () => {
    await expect(
      insertDoctor({ ...TEST_DOCTOR, phoneNumber: DEFAULT_DOCTOR.phoneNumber })
    ).rejects.toThrow(AppError);
  });

  it('selectDoctorByField → Should return doctor by id', async () => {
    const doctor = await selectDoctorByField('id', DEFAULT_DOCTOR_ID);
    expect(doctor).not.toBeNull();
    expect(doctor!.id).toBe(DEFAULT_DOCTOR_ID);
  });

  it('selectDoctorByField → Should return null for non-existing id', async () => {
    const doctor = await selectDoctorByField('id', 9999);
    expect(doctor).toBeNull();
  });

  it('selectDoctorByField → Should return doctor by email', async () => {
    const doctor = await selectDoctorByField('email', DEFAULT_DOCTOR.email);
    expect(doctor).not.toBeNull();
    expect(doctor!.email).toBe(DEFAULT_DOCTOR.email);
  });

  it('selectDoctorByField → Should return null for non-existing email', async () => {
    const doctor = await selectDoctorByField('email', 'nope@example.com');
    expect(doctor).toBeNull();
  });

  it('selectDoctorByField → Should return doctor by phoneNumber', async () => {
    const doctor = await selectDoctorByField('phoneNumber', DEFAULT_DOCTOR.phoneNumber);
    expect(doctor).not.toBeNull();
    expect(doctor!.phoneNumber).toBe(DEFAULT_DOCTOR.phoneNumber);
  });

  it('selectDoctorByField → Should return null for non-existing phoneNumber', async () => {
    const doctor = await selectDoctorByField('phoneNumber', '00000000000');
    expect(doctor).toBeNull();
  });

  it('selectDoctorByField → Should return doctor by crm', async () => {
    const doctor = await selectDoctorByField('crm', DEFAULT_DOCTOR.crm);
    expect(doctor).not.toBeNull();
    expect(doctor!.crm).toBe(DEFAULT_DOCTOR.crm);
  });

  it('selectDoctorByField → Should return null for non-existing crm', async () => {
    const doctor = await selectDoctorByField('crm', '000000');
    expect(doctor).toBeNull();
  });

  it('selectDoctorByField → Should return doctor by cpf', async () => {
    const doctor = await selectDoctorByField('cpf', DEFAULT_DOCTOR.cpf);
    expect(doctor).not.toBeNull();
    expect(doctor!.cpf).toBe(DEFAULT_DOCTOR.cpf);
  });

  it('selectDoctorByField → Should return null for non-existing cpf', async () => {
    const doctor = await selectDoctorByField('cpf', '00000000000');
    expect(doctor).toBeNull();
  });

  it('selectAllDoctors → Should return all doctors', async () => {
    await insertDoctor(TEST_DOCTOR);
    const doctors = await selectAllDoctors();
    expect(doctors.length).toBe(2);
  });

  it('selectAllDoctors → Should return [] when no doctors', async () => {
    await prisma.doctor.deleteMany();
    const doctors = await selectAllDoctors();
    expect(doctors).toEqual([]);
  });
});
