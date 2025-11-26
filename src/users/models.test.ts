import { describe, it, beforeEach, expect } from 'bun:test';
import { pool } from '../db/connection.ts';

import {
  insertUser,
  selectUserByEmail,
  selectUserById,
  selectUserByPhoneNumber,
} from './models.ts';

import type { InsertUser } from './types.ts';
import { AppError } from '../utils/AppError.ts';

const DEFAULT_USER: InsertUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  passwordHash: 'hash123',
  phoneNumber: '99999999',
};

let DEFAULT_USER_ID: number;

beforeEach(async () => {
  await pool.query('DELETE FROM referrals');
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
    });

    expect(result).toHaveProperty('id');
    expect(typeof result.id).toBe('number');
  });

  it('insertUser → Should throw AppError for duplicated email', async () => {
    expect(
      insertUser({
        firstName: 'Dup',
        lastName: 'Email',
        email: DEFAULT_USER.email,
        passwordHash: 'pass',
        phoneNumber: '77777777',
      })
    ).rejects.toThrow(AppError);
  });

  it('insertUser → Should throw AppError for duplicated phone number', async () => {
    expect(
      insertUser({
        firstName: 'Dup',
        lastName: 'Phone',
        email: 'unique@example.com',
        passwordHash: 'pass',
        phoneNumber: DEFAULT_USER.phoneNumber,
      })
    ).rejects.toThrow(AppError);
  });

  it('selectUserByEmail → Should return a user', async () => {
    const user = await selectUserByEmail(DEFAULT_USER.email);

    expect(user).not.toBeNull();
    expect(user?.email).toBe(DEFAULT_USER.email);
  });

  it('selectUserById → Should return a user', async () => {
    const user = await selectUserById(DEFAULT_USER_ID);

    expect(user).not.toBeNull();
    expect(user?.id).toBe(DEFAULT_USER_ID);
  });

  it('selectUserByPhoneNumber → Should return a user', async () => {
    const user = await selectUserByPhoneNumber(DEFAULT_USER.phoneNumber!);

    expect(user).not.toBeNull();
    expect(user?.phoneNumber).toBe(DEFAULT_USER.phoneNumber);
  });

  it('selectUserByEmail → Should return null for non-existing email', async () => {
    const user = await selectUserByEmail('nope@example.com');
    expect(user).toBeNull();
  });

  it('selectUserById → Should return null for non-existing id', async () => {
    const user = await selectUserById(9999);
    expect(user).toBeNull();
  });

  it('selectUserByPhoneNumber → Should return null for non-existing phone', async () => {
    const user = await selectUserByPhoneNumber('not-a-phone');
    expect(user).toBeNull();
  });
});
