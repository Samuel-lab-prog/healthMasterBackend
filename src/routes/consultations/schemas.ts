import { t } from 'elysia';
import * as s from '../../utils/schemas.ts';

export const consultationStatusSchema = t.UnionEnum([
  'scheduled',
  'completed',
  'cancelled',
  'no_show',
]);

export const consultationTypeSchema = t.UnionEnum(['return_visit', 'exam', 'routine', 'checkup'], {
  example: 'routine',
});

export const consultationSchema = t.Object({
  id: s.idSchema,
  userFullName: s.fullNameSchema,
  doctorFullName: s.fullNameSchema,
  date: s.DateSchema,
  notes: s.notesSchema,
  createdAt: s.createdAtSchema,
  updatedAt: s.updatedAtSchema,

  location: t.String(),
  status: consultationStatusSchema,
  type: consultationTypeSchema,
  endTime: s.DateSchema,
});

export const postConsultationSchema = t.Object({
  userId: s.idSchema,
  doctorId: s.idSchema,
  date: s.DateSchema,
  notes: s.notesSchema,

  location: t.String(),
  status: consultationStatusSchema,
  type: consultationTypeSchema,
  endTime: s.DateSchema,
});

export const userConsultationSchema = t.Object({
  id: s.idSchema,
  date: s.DateSchema,
  notes: s.notesSchema,
  doctorId: s.idSchema,
  doctorName: s.fullNameSchema,
  doctorSpeciality: t.String(),

  location: t.String(),
  status: consultationStatusSchema,
  type: consultationTypeSchema,
  endTime: s.DateSchema,
});

export const doctorConsultationSchema = t.Object({
  id: s.idSchema,
  date: s.DateSchema,
  notes: s.notesSchema,
  userId: s.idSchema,
  userName: s.fullNameSchema,
  userPhoneNumber: s.phoneNumberSchema,
  userEmail: s.emailSchema,

  location: t.String(),
  status: consultationStatusSchema,
  type: consultationTypeSchema,
  endTime: s.DateSchema,
});
