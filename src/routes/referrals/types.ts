import {
  postReferralSchema,
  referralSchema,
  userReferralSchema,
  doctorReferralSchema,
} from './schemas';
import type { Prisma } from '../../prisma/generated/prisma/client';
import type { ReferralUncheckedCreateInput } from '../../prisma/generated/prisma/models.ts';

export type Referral = (typeof referralSchema)['static'];
export type PostReferral = (typeof postReferralSchema)['static'];
export type UserReferral = (typeof userReferralSchema)['static'];
export type DoctorReferral = (typeof doctorReferralSchema)['static'];

export type ReferralRow = Prisma.ReferralGetPayload<{
  include: {
    consultation: {
      select: {
        user: {
          select: { firstName: true; lastName: true; phoneNumber: true; email: true };
        };
        doctor: {
          select: { firstName: true; lastName: true };
        };
      };
    };
  };
}>;

export type CreateReferral = ReferralUncheckedCreateInput;

export type UserReferralRow = Prisma.ReferralGetPayload<{
  include: {
    consultation: {
      select: {
        doctor: {
          select: { firstName: true; lastName: true };
        };
      };
    };
  };
}>;

export type DoctorReferralRow = Prisma.ReferralGetPayload<{
  include: {
    consultation: {
      select: {
        user: {
          select: { firstName: true; lastName: true; phoneNumber: true; email: true };
        };
      };
    };
  };
}>;

export function mapReferralRowToReferral(row: ReferralRow): Referral {
  return {
    id: row.id,
    consultationId: row.consultationId,
    notes: row.notes,
    userName: `${row.consultation.user.firstName} ${row.consultation.user.lastName}`,
    doctorName: `${row.consultation.doctor.firstName} ${row.consultation.doctor.lastName}`,
    userPhoneNumber: row.consultation.user.phoneNumber,
    userEmail: row.consultation.user.email,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapUserReferralRowToUserReferral(row: UserReferralRow): UserReferral {
  return {
    id: row.id,
    notes: row.notes,
    doctorName: `${row.consultation.doctor.firstName} ${row.consultation.doctor.lastName}`,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapDoctorReferralRowToDoctorReferral(row: DoctorReferralRow): DoctorReferral {
  return {
    id: row.id,
    notes: row.notes,
    userName: `${row.consultation.user.firstName} ${row.consultation.user.lastName}`,
    userPhoneNumber: row.consultation.user.phoneNumber,
    userEmail: row.consultation.user.email,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
