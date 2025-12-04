import { prisma } from '../../prisma/client.ts';
import * as types from './types.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';

const referralIncludes = {
  consultation: {
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
          email: true,
        },
      },
      doctor: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
};

const userReferralIncludes = {
  consultation: {
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
};

const doctorReferralIncludes = {
  consultation: {
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
          email: true,
        },
      },
    },
  },
};

export function insertReferral(data: types.InsertReferral): Promise<Pick<types.ReferralRow, 'id'>> {
  return withPrismaErrorHandling(async () => {
    return prisma.referral.create({
      data,
      select: { id: true },
    });
  });
}

export function selectReferralById(referralId: number): Promise<types.ReferralRow | null> {
  return withPrismaErrorHandling(() =>
    prisma.referral.findUnique({
      where: { id: referralId },
      include: referralIncludes,
    })
  );
}

export function selectAllReferrals(): Promise<types.ReferralRow[]> {
  return withPrismaErrorHandling(() =>
    prisma.referral.findMany({
      include: referralIncludes,
    })
  );
}

export function selectReferralsByConsultationId(
  consultationId: number
): Promise<types.ReferralRow[]> {
  return withPrismaErrorHandling(() =>
    prisma.referral.findMany({
      where: { consultationId },
      include: referralIncludes,
    })
  );
}

export function selectUserReferrals(userId: number): Promise<types.UserReferralRow[]> {
  return withPrismaErrorHandling(() =>
    prisma.referral.findMany({
      where: {
        consultation: { userId },
      },
      include: userReferralIncludes,
    })
  );
}

export function selectDoctorReferrals(doctorId: number): Promise<types.DoctorReferralRow[]> {
  return withPrismaErrorHandling(() =>
    prisma.referral.findMany({
      where: {
        consultation: { doctorId },
      },
      include: doctorReferralIncludes,
    })
  );
}
