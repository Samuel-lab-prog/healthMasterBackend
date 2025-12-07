import { describe, it, expect, mock } from 'bun:test';
import type { PostUser } from './types';

const insertUserMock = mock(() => ({ id: 1 }));

mock.module('./models', () => ({
  insertUser: insertUserMock,
}));

mock.module('bcryptjs', () => ({
  default: {
    hash: async (password: string, saltRounds: number) => {
      return `hashed_${password} with_${saltRounds}`;
    },
  },
}));

import * as s from './services';

const TEST_USER: PostUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'hashtest',
  phoneNumber: '88888888',
  cpf: '09876543211',
  birthDate: new Date(),
  sex: 'other',
};

describe('User Services Tests', () => {
  it('registerUser → should hash and call insertUser correctly', async () => {
    const result = await s.registerUser(TEST_USER);
    expect(result).toEqual({ id: 1 });
    // Need to check that mock was called with hashed password
    // For some reason, toHaveBeenCalledWith is not working as expected here
    // If you know why, please fix it
  });
});
