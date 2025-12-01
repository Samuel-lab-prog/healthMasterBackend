import { t } from 'elysia';
import {
  idSchema,
  createdAtSchema,
  updatedAtSchema,
  notesSchema,
  fullNameSchema,
  emailSchema,
  phoneNumberSchema,
} from '../../utils/schemas.ts';

export const postReferralSchema = t.Object({
  consultationId: idSchema,
  notes: notesSchema,
});

export const referralSchema = t.Object({
  id: idSchema,
  consultationId: idSchema,
  notes: notesSchema,
  userName: fullNameSchema,
  doctorName: fullNameSchema,
  userPhoneNumber: phoneNumberSchema,
  userEmail: emailSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const userReferralSchema = t.Object({
  id: idSchema,
  notes: notesSchema,
  doctorName: fullNameSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const doctorReferralSchema = t.Object({
  id: idSchema,
  notes: notesSchema,
  userName: fullNameSchema,
  userPhoneNumber: phoneNumberSchema,
  userEmail: emailSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});
