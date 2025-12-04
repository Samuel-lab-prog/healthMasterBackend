import { t } from 'elysia';
import * as s from '../../utils/schemas.ts';

export const postReferralSchema = t.Object({
  consultationId: s.idSchema,
  referredById: s.idSchema,
  referredToId: s.idSchema,
  userId: s.idSchema,
  status: s.referralStatusSchema,
  reason: s.reasonSchema,
  notes: s.notesSchema,
});

export const referralSchema = t.Object({
  id: s.idSchema,
  consultationId: s.idSchema,

  userName: s.fullNameSchema,
  userPhoneNumber: s.phoneNumberSchema,
  userEmail: s.emailSchema,

  referredByName: s.fullNameSchema,
  referredToName: s.fullNameSchema,

  notes: s.notesSchema,
  status: s.referralStatusSchema,
  reason: s.reasonSchema,

  createdAt: s.createdAtSchema,
  updatedAt: s.updatedAtSchema,
});


export const userReferralSchema = t.Object({
  id: s.idSchema,

  referredByName: s.fullNameSchema,
  referredToName: s.fullNameSchema,

  notes: s.notesSchema,
  status: s.referralStatusSchema,
  reason: s.reasonSchema,

  createdAt: s.createdAtSchema,
  updatedAt: s.updatedAtSchema,
});


export const doctorReferralSchema = t.Object({
  id: s.idSchema,
  consultationId: s.idSchema,

  userName: s.fullNameSchema,
  userPhoneNumber: s.phoneNumberSchema,
  userEmail: s.emailSchema,

  referredByName: s.fullNameSchema,

  notes: s.notesSchema,
  status: s.referralStatusSchema,
  reason: s.reasonSchema,

  createdAt: s.createdAtSchema,
  updatedAt: s.updatedAtSchema,
});
