import { t } from 'elysia';
import { AppError } from '../utils/AppError';

export const userIdSchema = t.Number({
  minimum: 1,
  example: 1,
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['User ID must be a valid number'],
    });
  },
});
export const doctorIdSchema = t.Number({
  minimum: 1,
  example: 1,
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Doctor ID must be a valid number'],
    });
  },
});

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

export const consultationDateSchema = t.String({
  example: new Date().toISOString(),
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Consultation date must be a valid ISO date string'],
    });
  }
});


export const createdAtSchema = t.Date({
  example: new Date(),
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Created at must be a valid date'],
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

export const notesSchema = t.String({
  maxLength: 1000,
  example: 'Patient is recovering well.',
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Notes must be a valid string with a maximum length of 1000 characters'],
    });
  },
});

export const consultationSchema = t.Object({
  id: consultationIdSchema,
  userId: userIdSchema,
  doctorId: doctorIdSchema,
  consultationDate: consultationDateSchema,
  notes: notesSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const postConsultationSchema = t.Object({
  userId: userIdSchema,
  doctorId: doctorIdSchema,
  consultationDate: consultationDateSchema,
  notes: notesSchema,
});

export const fullConsultationSchema = consultationSchema;
export const insertConsultationSchema = postConsultationSchema;
