import { t } from 'elysia';
import { throwBadRequestError, throwUnprocessableEntityError } from './AppError';

export function makeValidationError(message: string) {
  return {
    error() {
      throwUnprocessableEntityError(message);
    },
  };
}

export function makeBadRequestError(message: string) {
  return {
    error() {
      throwBadRequestError(message);
    },
  };
}
export const appErrorSchema = t.Object({
  errorMessages: t.Array(t.String()),
  statusCode: t.Number(),
});

export const tokenSchema = t.Object({
  token: t.String({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    ...makeBadRequestError('Token must be a valid string'),
  }),
});

export const idSchema = t.Number({
  minimum: 1,
  example: 1,
});

export const stringDateSchema = t.String({
  format: 'date-time',
  example: '2024-01-01T12:00:00Z',
  ...makeValidationError('Date must be in ISO 8601 format'),
});

export const createdAtSchema = t.Date({
  example: new Date(),
  ...makeValidationError('createdAt must be a valid date'),
});

export const updatedAtSchema = t.Union([t.String(), t.Null()], {
  example: null,
  ...makeValidationError('updatedAt must be a valid date or null'),
});

export const emailSchema = t.String({
  format: 'email',
  example: 'user@example.com',
  ...makeValidationError('Email must be a valid email address'),
});

export const passwordSchema = t.String({
  minLength: 6,
  maxLength: 30,
  example: '12345678',
  ...makeValidationError('Password must be between 6 and 30 characters long'),
});

export const phoneNumberSchema = t.String({
  minLength: 10,
  maxLength: 15,
  example: '+1234567890',
  ...makeValidationError('Phone number must be between 10 and 15 characters long'),
});

export const cpfSchema = t.String({
  minLength: 11,
  maxLength: 14,
  example: '123.456.789-00',
  ...makeValidationError('CPF must be between 11 and 14 characters long'),
});

export const firstNameSchema = t.String({
  minLength: 3,
  maxLength: 30,
  example: 'David',
  ...makeValidationError('First name must be between 3 and 30 characters long'),
});

export const lastNameSchema = t.String({
  minLength: 3,
  maxLength: 30,
  example: 'Smith',
  ...makeValidationError('Last name must be between 3 and 30 characters long'),
});
