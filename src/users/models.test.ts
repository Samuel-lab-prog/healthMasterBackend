import { describe, it, beforeEach, expect } from 'bun:test';
import { pool } from '../db/connection.ts';
import { AppError } from '../utils/AppError.ts';
import {
  insertUser,
  selectUserById,
  selectUserByCPF,
  selectUserByEmail,
  selectUserByPhoneNumber,
} from './models.ts';
import type { InsertUser } from './types.ts';

const DEFAULT_USER: InsertUser = {
  firstName: 'Default',
  lastName: 'User',
  email: 'default@example.com',
  passwordHash: 'hashdefault',
  phoneNumber: '99999999',
  cpf: '12345678900',
  birthDate: '1990-01-01',
};

const TEST_USER: InsertUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  passwordHash: 'hashtest',
  phoneNumber: '88888888',
  cpf: '09876543211',
  birthDate: '1995-05-15',
};

let DEFAULT_USER_ID: number;

beforeEach(async () => {
  await pool.query('DELETE FROM referrals'); // Clear dependent tables first
  await pool.query('DELETE FROM consultations');
  await pool.query('DELETE FROM users');

  DEFAULT_USER_ID = (await insertUser(DEFAULT_USER)).id;
});

describe('User Model Tests', () => {
  it('insertUser → Should insert and return an id', async () => {
    const result = await insertUser({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      passwordHash: 'hashabc',
      phoneNumber: '88888888',
      cpf: '09876543211',
      birthDate: '1995-05-15',
    });

    expect(result).toHaveProperty('id');
    expect(typeof result.id).toBe('number');
  });

  it('insertUser → Should throw AppError for duplicated email', async () => {
    expect(
      insertUser({
        ...TEST_USER,
        email: DEFAULT_USER.email
      }),
    ).rejects.toThrow(AppError);
  });

  it('insertUser → Should throw AppError for duplicated CPF', async () => {
    expect(
      insertUser({
        ...TEST_USER,
        cpf: DEFAULT_USER.cpf!
      })
    ).rejects.toThrow(AppError);
  });

  it('insertUser → Should throw AppError for duplicated phone number', async () => {
    expect(
      insertUser({
        ...TEST_USER,
        phoneNumber: DEFAULT_USER.phoneNumber!,
      })
    ).rejects.toThrow(AppError);
  });

  it('selectUserById → Should return a user', async () => {
    const user = await selectUserById(DEFAULT_USER_ID);

    expect(user).not.toBeNull();
    expect(user?.id).toBe(DEFAULT_USER_ID);
  });

  it('selectUserById → Should return null for non-existing id', async () => {
    const user = await selectUserById(9999);

    expect(user).toBeNull();
  });

  it('selectUserByCPF → Should return a user', async () => {
    const user = await selectUserByCPF(DEFAULT_USER.cpf!);

    expect(user).not.toBeNull();
    expect(user?.cpf).toBe(DEFAULT_USER.cpf);
  });

  it('selectUserByCPF → Should return null for non-existing CPF', async () => {
    const user = await selectUserByCPF('00000000000');
    expect(user).toBeNull();
  });

  it('selectUserByEmail → Should return a user', async () => {
    const user = await selectUserByEmail(DEFAULT_USER.email);

    expect(user).not.toBeNull();
    expect(user?.email).toBe(DEFAULT_USER.email);
  });

  it('selectUserByEmail → Should return null for non-existing email', async () => {
    const user = await selectUserByEmail('nope@example.com');
    expect(user).toBeNull();
  });

  it('selectUserByPhoneNumber → Should return a user', async () => {
    const user = await selectUserByPhoneNumber(DEFAULT_USER.phoneNumber!);

    expect(user).not.toBeNull();
    expect(user?.phoneNumber).toBe(DEFAULT_USER.phoneNumber);
  });

  it('selectUserByPhoneNumber → Should return null for non-existing phone', async () => {
    const user = await selectUserByPhoneNumber('not-a-phone');

    expect(user).toBeNull();
  });
});
