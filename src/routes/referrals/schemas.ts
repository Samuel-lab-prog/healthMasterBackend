import { t } from 'elysia';
import * as s from '../../utils/schemas.ts';

export const postReferralSchema = t.Object({
  consultationId: s.idSchema,
  notes: s.notesSchema,
});

export const referralSchema = t.Object({
  id: s.idSchema,
  consultationId: s.idSchema,
  notes: s.notesSchema,
  userName: s.fullNameSchema,
  doctorName: s.fullNameSchema,
  userPhoneNumber: s.phoneNumberSchema,
  userEmail: s.emailSchema,
  createdAt: s.createdAtSchema,
  updatedAt: s.updatedAtSchema,
});

export const userReferralSchema = t.Object({
  id: s.idSchema,
  notes: s.notesSchema,
  doctorName: s.fullNameSchema,
  createdAt: s.createdAtSchema,
  updatedAt: s.updatedAtSchema,
});

export const doctorReferralSchema = t.Object({
  id: s.idSchema,
  notes: s.notesSchema,
  userName: s.fullNameSchema,
  userPhoneNumber: s.phoneNumberSchema,
  userEmail: s.emailSchema,
  createdAt: s.createdAtSchema,
  updatedAt: s.updatedAtSchema,
});
