import { t } from 'elysia';
import {
  idSchema,
  stringDateSchema,
  notesSchema,
  createdAtSchema,
  updatedAtSchema,
} from '../../utils/schemas.ts';

export const consultationSchema = t.Object({
  id: idSchema,
  userId: idSchema,
  doctorId: idSchema,
  consultationDate: stringDateSchema,
  notes: notesSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const postConsultationSchema = t.Object({
  userId: idSchema,
  doctorId: idSchema,
  consultationDate: stringDateSchema,
  notes: notesSchema,
});

export const userConsultationSchema = t.Object({
  id: idSchema,
  date: stringDateSchema,
  notes: notesSchema,
  doctorId: idSchema,
  doctorName: t.String(),
  doctorSpeciality: t.String(),
});

export const doctorConsultationSchema = t.Object({
  id: idSchema,
  date: stringDateSchema,
  notes: notesSchema,
  userId: idSchema,
  userName: t.String(),
});

export const fullConsultationSchema = consultationSchema;
export const insertConsultationSchema = postConsultationSchema;
