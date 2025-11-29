import { t } from 'elysia';
import { idSchema, createdAtSchema, updatedAtSchema, notesSchema } from '../../utils/schemas.ts';

export const postReferralSchema = t.Object({
  consultationId: idSchema,
  notes: notesSchema,
});

export const referralSchema = t.Object({
  id: idSchema,
  consultationId: idSchema,
  notes: notesSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const fullReferralSchema = referralSchema;
export const insertReferralSchema = postReferralSchema;
