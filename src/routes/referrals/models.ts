import { prisma } from '../../prisma/client.ts';
import * as types from './types.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';

const referralIncludes = {
  user: {
    select: {
      firstName: true,
      lastName: true,
      phoneNumber: true,
      email: true,
    },
  },
  referredBy: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
  referredTo: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
  consultation: {
    select: {
      id: true,
      deletedAt: true,
    },
  },
};

const userReferralIncludes = {
  referredBy: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
  referredTo: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
};

const doctorReferralIncludes = {
  user: {
    select: {
      firstName: true,
      lastName: true,
      phoneNumber: true,
      email: true,
    },
  },
  referredBy: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
};

export function insertReferral(
  data: types.InsertReferral
): Promise<Pick<types.ReferralRow, 'id'>> {
  return withPrismaErrorHandling<Pick<types.ReferralRow, 'id'>>(async () => {
    return prisma.referral.create({
      data,
      select: { id: true },
    });
  });
}

export function selectReferralById(
  referralId: number
): Promise<types.ReferralRow | null> {
  return withPrismaErrorHandling<types.ReferralRow | null>(() =>
    prisma.referral.findUnique({
      where: { id: referralId },
      include: referralIncludes,
    })
  );
}

export function selectAllReferrals(): Promise<types.ReferralRow[]> {
  return withPrismaErrorHandling<types.ReferralRow[]>(() =>
    prisma.referral.findMany({
      where: {
        deletedAt: null,
        consultation: {
          deletedAt: null,
        },
      },
      include: referralIncludes,
    })
  );
}

export function selectReferralsByConsultationId(
  consultationId: number
): Promise<types.ReferralRow[]> {
  return withPrismaErrorHandling<types.ReferralRow[]>(() =>
    prisma.referral.findMany({
      where: {
        consultationId,
        deletedAt: null,
        consultation: {
          deletedAt: null,
        },
      },
      include: referralIncludes,
    })
  );
}

export function selectUserReferrals(
  userId: number
): Promise<types.UserReferralRow[]> {
  return withPrismaErrorHandling<types.UserReferralRow[]>(() =>
    prisma.referral.findMany({
      where: {
        deletedAt: null,
        consultation: {
          userId,
          deletedAt: null,
        },
      },
      include: userReferralIncludes,
    })
  );
}

export function selectDoctorReferrals(
  doctorId: number
): Promise<types.DoctorReferralRow[]> {
  return withPrismaErrorHandling<types.DoctorReferralRow[]>(() =>
    prisma.referral.findMany({
      where: {
        deletedAt: null,
        consultation: {
          doctorId,
          deletedAt: null,
        },
      },
      include: doctorReferralIncludes,
    })
  );
}

export function softDeleteReferral(
  referralId: number
): Promise<Pick<types.ReferralRow, 'id'>> {
  return withPrismaErrorHandling<Pick<types.ReferralRow, 'id'>>(async () => {
    return prisma.referral.update({
      where: { id: referralId },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  });
}

export function updateReferralStatus(
  referralId: number,
  status: types.ReferralStatus
): Promise<types.ReferralRow> {
  return withPrismaErrorHandling<types.ReferralRow>(async () => {
    return prisma.referral.update({
      where: { id: referralId },
      data: { status },
      include: referralIncludes,
    });
  });
}
