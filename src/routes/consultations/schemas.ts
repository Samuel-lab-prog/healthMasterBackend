import { t } from 'elysia';
import {
  idSchema,
  stringDateSchema,
  notesSchema,
  createdAtSchema,
  updatedAtSchema,
  fullNameSchema,
  phoneNumberSchema,
  emailSchema,
} from '../../utils/schemas.ts';

export const consultationSchema = t.Object({
  id: idSchema,
  userFullName: fullNameSchema,
  doctorFullName: fullNameSchema,
  date: stringDateSchema,
  notes: notesSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const postConsultationSchema = t.Object({
  userId: idSchema,
  doctorId: idSchema,
  date: stringDateSchema,
  notes: notesSchema,
});

export const userConsultationSchema = t.Object({
  id: idSchema,
  date: stringDateSchema,
  notes: notesSchema,
  doctorId: idSchema,
  doctorName: fullNameSchema,
  doctorSpeciality: t.String(),
});

export const doctorConsultationSchema = t.Object({
  id: idSchema,
  date: stringDateSchema,
  notes: notesSchema,
  userId: idSchema,
  userName: fullNameSchema,
  userPhoneNumber: phoneNumberSchema,
  userEmail: emailSchema,
});
