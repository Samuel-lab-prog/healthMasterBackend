import {
  postReferralSchema,
  insertReferralSchema,
  referralSchema,
  fullReferralSchema,
} from './schemas';

export type ReferralRow = {
  id: number;
  notes: string;
  consultation_id: number;
  created_at: Date;
  updated_at: string | null;
};

export type Referral = (typeof referralSchema)['static'];
export type FullReferral = (typeof fullReferralSchema)['static'];
export type PostReferral = (typeof postReferralSchema)['static'];
export type InsertReferral = (typeof insertReferralSchema)['static'];

export function mapReferralRowToFullReferral(ReferralRow: ReferralRow): FullReferral {
  return {
    id: ReferralRow.id,
    notes: ReferralRow.notes,
    consultationId: ReferralRow.consultation_id,
    createdAt: ReferralRow.created_at,
    updatedAt: ReferralRow.updated_at ? ReferralRow.updated_at : null,
  };
}

export function mapFullReferralToReferral(fullReferral: FullReferral): Referral {
  return {
    id: fullReferral.id,
    notes: fullReferral.notes,
    consultationId: fullReferral.consultationId,
    createdAt: fullReferral.createdAt,
    updatedAt: fullReferral.updatedAt,
  };
}
