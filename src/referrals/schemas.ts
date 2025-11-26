import { t } from 'elysia';
import { AppError } from '../utils/AppError';

export const consultationIdSchema = t.Number({
  minimum: 1,
  example: 1,
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Consultation ID must be a valid number'],
    });
  },
});

export const referralIdSchema = t.Number({
  minimum: 1,
  example: 1,
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Referral ID must be a valid number'],
    });
  },
});

export const notesSchema = t.String({
  minLength: 10,
  maxLength: 1000,
  example: 'Patient shows symptoms of ...',
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Notes must be between 10 and 1000 characters long'],
    });
  },
});

export const createdAtSchema = t.Date({
  example: new Date(),
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['createdAt must be a valid date'],
    });
  },
});

export const updatedAtSchema = t.Union([t.Date(), t.Null()], {
  example: null,
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['updatedAt must be a valid date or null'],
    });
  },
});

export const postReferralSchema = t.Object({
  consultationId: consultationIdSchema,
  notes: notesSchema,
});

export const referralSchema = t.Object({
  id: referralIdSchema,
  consultationId: consultationIdSchema,
  notes: notesSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});
export const fullReferralSchema = referralSchema;
export const insertReferralSchema = postReferralSchema;
