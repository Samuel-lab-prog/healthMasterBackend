import * as schemas from './schemas';
import type { Prisma } from '../../prisma/generated/prisma-client/browser';

export type Referral = typeof schemas.referralSchema.static;
export type PostReferral = typeof schemas.postReferralSchema.static;
export type UserReferral = typeof schemas.userReferralSchema.static;
export type DoctorReferral = typeof schemas.doctorReferralSchema.static;
export type InsertReferral = Prisma.ReferralUncheckedCreateInput;
export type ReferralStatus = Referral['status'];
export type ReferralRow = Prisma.ReferralGetPayload<{
  include: {
    user: {
      select: {
        firstName: true;
        lastName: true;
        phoneNumber: true;
        email: true;
      };
    };
    referredBy: {
      select: {
        firstName: true;
        lastName: true;
      };
    };
    referredTo: {
      select: {
        firstName: true;
        lastName: true;
      };
    };
    consultation: {
      select: {
        id: true;
      };
    }
  };
}>;

export type UserReferralRow = Prisma.ReferralGetPayload<{
  include: {
    referredBy: {
      select: {
        firstName: true;
        lastName: true;
      };
    };
    referredTo: {
      select: {
        firstName: true;
        lastName: true;
      };
    };
  };
}>;

export type DoctorReferralRow = Prisma.ReferralGetPayload<{
  include: {
    user: {
      select: {
        firstName: true;
        lastName: true;
        phoneNumber: true;
        email: true;
      };
    };
    referredBy: {
      select: {
        firstName: true;
        lastName: true;
      };
    };
  };
}>;


export function mapReferralRowToReferral(row: ReferralRow): Referral {
  return {
    id: row.id,
    consultationId: row.consultationId,

    reason: row.reason,
    notes: row.notes ?? null,
    status: row.status as Referral['status'],

    userName: `${row.user.firstName} ${row.user.lastName}`,
    userPhoneNumber: row.user.phoneNumber,
    userEmail: row.user.email,

    referredByName: `${row.referredBy.firstName} ${row.referredBy.lastName}`,
    referredToName: `${row.referredTo.firstName} ${row.referredTo.lastName}`,

    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapUserReferralRowToUserReferral(
  row: UserReferralRow
): UserReferral {
  return {
    id: row.id,

    reason: row.reason,
    notes: row.notes ?? null,
    status: row.status as Referral['status'],

    referredByName: `${row.referredBy.firstName} ${row.referredBy.lastName}`,
    referredToName: `${row.referredTo.firstName} ${row.referredTo.lastName}`,

    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapDoctorReferralRowToDoctorReferral(
  row: DoctorReferralRow
): DoctorReferral {
  return {
    id: row.id,
    consultationId: row.consultationId,
    reason: row.reason,
    notes: row.notes ?? null,
    status: row.status as Referral['status'],

    userName: `${row.user.firstName} ${row.user.lastName}`,
    userPhoneNumber: row.user.phoneNumber,
    userEmail: row.user.email,

    referredByName: `${row.referredBy.firstName} ${row.referredBy.lastName}`,

    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
