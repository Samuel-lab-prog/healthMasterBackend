import { t } from 'elysia';
import { makeBadRequestError, makeValidationError } from './AppError';

// Common Schemas
//---------------------------------------------------------------------------//

export const DateSchema = t.Date({
  example: '2024-01-01T12:00:00Z',
  ...makeValidationError('Date must be a valid date'),
});

export const createdAtSchema = t.Date({
  example: '2024-01-01T12:00:00Z',
  ...makeValidationError('createdAt must be a valid date string'),
});

export const deletedAtSchema = t.Union([t.Date(), t.Null()], {
  example: null,
  ...makeValidationError('deletedAt must be a valid date string or null'),
});

export const updatedAtSchema = t.Union([t.Date(), t.Null()], {
  example: null,
  ...makeValidationError('updatedAt must be a valid date or null'),
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
export const loginSchema = t.Object({
  email: t.String({
    format: 'email',
    example: 'user@example.com',
    ...makeValidationError('Email must be a valid email address'),
  }),
  password: t.String({
    minLength: 6,
    maxLength: 30,
    example: '12345678',
    ...makeValidationError('Password must be between 6 and 30 characters long'),
  }),
});

//---------------------------------------------------------------------------//

export const referralStatusSchema = t.UnionEnum(['pending', 'completed', 'cancelled'], {
  example: 'pending',
  ...makeBadRequestError('Status must be one of: pending, completed, cancelled'),
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

export const fullNameSchema = t.String({
  minLength: 6,
  maxLength: 60,
  example: 'David Smith',
  ...makeValidationError('Full name must be between 6 and 60 characters long'),
});

export const notesSchema = t.Union([t.String(), t.Null()], {
  example: 'Patient shows signs of improvement.',
  ...makeValidationError('Notes must be a valid string or null'),
});

export const reasonSchema = t.Union([t.String()], {
  example: 'Referral for specialized care.',
  ...makeValidationError('Reason must be a valid string or null'),
});

export const referredToIdSchema = t.Union([t.Number(), t.Null()], {
  minimum: 1,
  example: 1,
});