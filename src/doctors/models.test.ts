import { describe, it, beforeEach, expect } from 'bun:test';
import { pool } from '../db/connection.ts';

import {
    insertDoctor,
    selectDoctorByEmail,
    selectDoctorById,
    selectDoctorByPhoneNumber,
} from './models';

import type { InsertDoctor } from './types';
import { AppError } from '../utils/AppError.ts';

const DEFAULT_DOCTOR: InsertDoctor = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    passwordHash: 'hash123',
    phoneNumber: '99999999',
    speciality: 'Cardiology',
    crm: '123456'
};

let DEFAULT_DOCTOR_ID: number;

beforeEach(async () => {
    await pool.query('DELETE FROM referrals');
    await pool.query('DELETE FROM consultations');
    await pool.query('DELETE FROM Doctors');

    DEFAULT_DOCTOR_ID = (await insertDoctor(DEFAULT_DOCTOR)).id;
});

describe('Doctor Model Tests', () => {

    it('insertDoctor → Should insert and return an id', async () => {
        const result = await insertDoctor({
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice@example.com',
            passwordHash: 'hashabc',
            phoneNumber: '88888888',
            speciality: 'Neurology',
            crm: '654321'
        });

        expect(result).toHaveProperty('id');
        expect(typeof result.id).toBe('number');
    });

    it('insertDoctor → Should throw AppError for duplicated email', async () => {
        expect(
            insertDoctor({
                firstName: 'Dup',
                lastName: 'Email',
                email: DEFAULT_DOCTOR.email,
                passwordHash: 'pass',
                phoneNumber: '77777777',
                speciality: 'Dermatology',
                crm: '111222'
            })
        ).rejects.toThrow(AppError);
    });

    it('insertDoctor → Should throw AppError for duplicated phone number', async () => {
        expect(
            insertDoctor({
                firstName: 'Dup',
                lastName: 'Phone',
                email: 'unique@example.com',
                passwordHash: 'pass',
                phoneNumber: DEFAULT_DOCTOR.phoneNumber,
                speciality: 'Dermatology',
                crm: '111222'
            })
        ).rejects.toThrow(AppError);
    });

    it('selectDoctorByEmail → Should return a Doctor', async () => {
        const Doctor = await selectDoctorByEmail(DEFAULT_DOCTOR.email);

        expect(Doctor).not.toBeNull();
        expect(Doctor?.email).toBe(DEFAULT_DOCTOR.email);
    });

    it('selectDoctorById → Should return a Doctor', async () => {
        const Doctor = await selectDoctorById(DEFAULT_DOCTOR_ID);

        expect(Doctor).not.toBeNull();
        expect(Doctor?.id).toBe(DEFAULT_DOCTOR_ID);
    });

    it('selectDoctorByPhoneNumber → Should return a Doctor', async () => {
        const Doctor = await selectDoctorByPhoneNumber(DEFAULT_DOCTOR.phoneNumber!);
        expect(Doctor).not.toBeNull();
        expect(Doctor?.phoneNumber).toBe(DEFAULT_DOCTOR.phoneNumber);
    });

    it('selectDoctorByEmail → Should return null for non-existing email', async () => {
        const Doctor = await selectDoctorByEmail('nope@example.com');
        expect(Doctor).toBeNull();
    });

    it('selectDoctorById → Should return null for non-existing id', async () => {
        const Doctor = await selectDoctorById(9999);
        expect(Doctor).toBeNull();
    });

    it('selectDoctorByPhoneNumber → Should return null for non-existing phone', async () => {
        const Doctor = await selectDoctorByPhoneNumber('not-a-phone');
        expect(Doctor).toBeNull();
    });
});
