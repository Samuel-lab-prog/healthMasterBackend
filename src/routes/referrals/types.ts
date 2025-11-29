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

export function mapReferralRowToFullReferral(row: ReferralRow): FullReferral {
  return {
    id: row.id,
    notes: row.notes,
    consultationId: row.consultation_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at ? row.updated_at : null,
  };
}

export function mapFullReferralToReferral(row: FullReferral): Referral {
  return {
    id: row.id,
    notes: row.notes,
    consultationId: row.consultationId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
