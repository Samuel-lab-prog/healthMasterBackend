import { t } from 'elysia';
import * as s from '../../utils/schemas.ts';

export const consultationSchema = t.Object({
  id: s.idSchema,
  userFullName: s.fullNameSchema,
  doctorFullName: s.fullNameSchema,
  date: s.stringDateSchema,
  notes: s.notesSchema,
  createdAt: s.createdAtSchema,
  updatedAt: s.updatedAtSchema,
});

export const postConsultationSchema = t.Object({
  userId: s.idSchema,
  doctorId: s.idSchema,
  date: s.stringDateSchema,
  notes: s.notesSchema,
});

export const userConsultationSchema = t.Object({
  id: s.idSchema,
  date: s.stringDateSchema,
  notes: s.notesSchema,
  doctorId: s.idSchema,
  doctorName: s.fullNameSchema,
  doctorSpeciality: t.String(),
});

export const doctorConsultationSchema = t.Object({
  id: s.idSchema,
  date: s.stringDateSchema,
  notes: s.notesSchema,
  userId: s.idSchema,
  userName: s.fullNameSchema,
  userPhoneNumber: s.phoneNumberSchema,
  userEmail: s.emailSchema,
});
