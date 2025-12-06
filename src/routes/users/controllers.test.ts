import { describe, it, expect } from 'bun:test';
import { userRouter } from './controllers.ts';
import type { PostUser } from './types.ts';

const VALID_USER_DATA: PostUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'SecurePassword123!',
  phoneNumber: '1234567890', // 10 characters, meets minLength requirement
  cpf: '12345678900', // 11 characters, meets CPF length validation
  birthDate: new Date('1990-01-01'),
  sex: 'male',
};

describe('User Controller Tests', () => {
  describe('POST /users/register - Validation', () => {
    it('should return 422 for invalid email format', async () => {
      const invalidData = {
        ...VALID_USER_DATA,
        email: 'invalid-email',
      };

      const response = await userRouter.handle(
        new Request('http://localhost/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invalidData),
        })
      );

      expect(response.status).toBe(422);
    });

    it('should return 422 for missing required fields', async () => {
      const incompleteData = {
        firstName: 'John',
        email: 'john@example.com',
      };

      const response = await userRouter.handle(
        new Request('http://localhost/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(incompleteData),
        })
      );

      expect(response.status).toBe(422);
    });

    it('should return 422 for invalid password (too short)', async () => {
      const invalidData = {
        ...VALID_USER_DATA,
        password: '123',
      };

      const response = await userRouter.handle(
        new Request('http://localhost/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invalidData),
        })
      );

      expect(response.status).toBe(422);
    });

    it('should return 422 for invalid CPF format', async () => {
      const invalidData = {
        ...VALID_USER_DATA,
        cpf: '123',
      };

      const response = await userRouter.handle(
        new Request('http://localhost/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invalidData),
        })
      );

      expect(response.status).toBe(422);
    });

    it('should return 422 for invalid phone number format', async () => {
      const invalidData = {
        ...VALID_USER_DATA,
        phoneNumber: '123',
      };

      const response = await userRouter.handle(
        new Request('http://localhost/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invalidData),
        })
      );

      expect(response.status).toBe(422);
    });

    it('should return 422 for invalid sex value', async () => {
      const invalidData = {
        ...VALID_USER_DATA,
        sex: 'invalid',
      };

      const response = await userRouter.handle(
        new Request('http://localhost/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invalidData),
        })
      );

      expect(response.status).toBe(422);
    });

    it('should return 422 for invalid birthDate format', async () => {
      const invalidData = {
        ...VALID_USER_DATA,
        birthDate: 'invalid-date' as any, // String instead of Date to test validation
      };

      const response = await userRouter.handle(
        new Request('http://localhost/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invalidData),
        })
      );

      expect(response.status).toBe(422);
    });

    it('should return 400 for invalid JSON body', async () => {
      const response = await userRouter.handle(
        new Request('http://localhost/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid json',
        })
      );

      expect(response.status).toBe(400);
    });

    it('should return 422 for empty request body', async () => {
      const response = await userRouter.handle(
        new Request('http://localhost/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
      );

      expect(response.status).toBe(422);
    });
  });
});
