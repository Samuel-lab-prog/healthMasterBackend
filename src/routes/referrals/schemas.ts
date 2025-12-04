import { t } from 'elysia';
import * as schemas from '../../utils/schemas.ts';

export const postReferralSchema = t.Object({
  consultationId: schemas.idSchema,
  notes: schemas.notesSchema,
});

export const referralSchema = t.Object({
  id: schemas.idSchema,
  consultationId: schemas.idSchema,
  notes: schemas.notesSchema,
  userName: schemas.fullNameSchema,
  doctorName: schemas.fullNameSchema,
  userPhoneNumber: schemas.phoneNumberSchema,
  userEmail: schemas.emailSchema,
  createdAt: schemas.createdAtSchema,
  updatedAt: schemas.updatedAtSchema,
});

export const userReferralSchema = t.Object({
  id: schemas.idSchema,
  notes: schemas.notesSchema,
  doctorName: schemas.fullNameSchema,
  createdAt: schemas.createdAtSchema,
  updatedAt: schemas.updatedAtSchema,
});

export const doctorReferralSchema = t.Object({
  id: schemas.idSchema,
  notes: schemas.notesSchema,
  userName: schemas.fullNameSchema,
  userPhoneNumber: schemas.phoneNumberSchema,
  userEmail: schemas.emailSchema,
  createdAt: schemas.createdAtSchema,
  updatedAt: schemas.updatedAtSchema,
});
