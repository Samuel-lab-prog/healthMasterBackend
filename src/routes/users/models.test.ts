import { describe, it, beforeEach, expect } from 'bun:test';
import { prisma } from '../../prisma/client.ts';
import type { InsertUser } from './types.ts';
import { AppError } from '../../utils/AppError.ts';
import { insertUser, selectUserByField } from './models.ts';

const DEFAULT_USER: InsertUser = {
  firstName: 'Default',
  lastName: 'User',
  email: 'default@example.com',
  password: 'hashdefault',
  phoneNumber: '99999999',
  cpf: '12345678900',
  birthDate: new Date(),
};

const TEST_USER: InsertUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'hashtest',
  phoneNumber: '88888888',
  cpf: '09876543211',
  birthDate: new Date(),
};

let DEFAULT_USER_ID: number;

beforeEach(async () => {
  await prisma.referral.deleteMany(); // Clear dependent tables first
  await prisma.consultation.deleteMany();
  await prisma.user.deleteMany();

  DEFAULT_USER_ID = (await insertUser(DEFAULT_USER)).id;
});

describe('User Model Tests', () => {
  it('insertUser → Should insert and return an id', async () => {
    const result = await insertUser({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'hashabc',
      phoneNumber: '88888888',
      cpf: '09876543211',
      birthDate: new Date(),
    });

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('id');
  });

  it('insertUser → Should throw AppError for duplicated email', async () => {
    expect(
      insertUser({
        ...TEST_USER,
        email: DEFAULT_USER.email,
      })
    ).rejects.toThrow(AppError);
  });

  it('insertUser → Should throw AppError for duplicated CPF', async () => {
    expect(
      insertUser({
        ...TEST_USER,
        cpf: DEFAULT_USER.cpf!,
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

  it('selectUserByField → Should return user by email', async () => {
    const user = await selectUserByField('email', DEFAULT_USER.email!);
    expect(user).not.toBeNull();
    expect(user!.id).toBe(DEFAULT_USER_ID);
  });

  it('selectUserByField → Should return user by id', async () => {
    const user = await selectUserByField('id', DEFAULT_USER_ID);
    expect(user).not.toBeNull();
    expect(user!.email).toBe(DEFAULT_USER.email);
  });

  it('selectUserByField → Should return user by phoneNumber', async () => {
    const user = await selectUserByField('phoneNumber', DEFAULT_USER.phoneNumber!);
    expect(user).not.toBeNull();
    expect(user!.phoneNumber).toBe(DEFAULT_USER.phoneNumber);
  });

  it('selectUserByField → Should return user by cpf', async () => {
    const user = await selectUserByField('cpf', DEFAULT_USER.cpf!);
    expect(user).not.toBeNull();
    expect(user!.cpf).toBe(DEFAULT_USER.cpf);
  });

  it('selectUserByField → Should return null for non-existing email', async () => {
    const user = await selectUserByField('email', 'nonexistent@example.com');
    expect(user).toBeNull();
  });

  it('selectUserByField → Should return null for non-existing cpf', async () => {
    const user = await selectUserByField('cpf', '00000000000');
    expect(user).toBeNull();
  });

  it('selectUserByField → Should return null for non-existing phoneNumber', async () => {
    const user = await selectUserByField('phoneNumber', '00000000');
    expect(user).toBeNull();
  });

  it('selectUserByField → Should return null for non-existing id', async () => {
    const user = await selectUserByField('id', 9999);
    expect(user).toBeNull();
  });
});
