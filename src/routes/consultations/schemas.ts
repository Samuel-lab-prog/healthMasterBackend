import { t } from 'elysia';
import { AppError } from '../../utils/AppError';

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
  examples: ['2024-06-15T14:30:00Z', '2024-12-01T09:00:00+02:00'],
}); // I'm not using t.Date() because of Elysia's date serialization issues

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

export const userConsultationSchema = t.Object({
  consultationId: consultationIdSchema,
  consultationDate: consultationDateSchema,
  consultationNotes: notesSchema,
  doctorId: doctorIdSchema,
  doctorName: t.String(),
  doctorSpeciality: t.String(),
});

export const doctorConsultationSchema = t.Object({
  consultationId: consultationIdSchema,
  userId: userIdSchema,
  consultationDate: consultationDateSchema,
  consultationNotes: notesSchema,
  userName: t.String(),
});

export const fullConsultationSchema = consultationSchema;
export const insertConsultationSchema = postConsultationSchema;
