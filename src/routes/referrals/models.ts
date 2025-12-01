import { prisma } from '../../prisma/client.ts';
import * as types from './types.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';

export async function insertReferral(
  data: types.CreateReferral
): Promise<Pick<types.ReferralRow, 'id'> | null> {
  return withPrismaErrorHandling(async () => {
    return (
      (await prisma.referral.create({
        data: data,
        select: { id: true },
      })) ?? null
    );
  });
}

const referralIncludes = {
  consultation: {
    include: {
      user: {
        select: { firstName: true, lastName: true, phoneNumber: true, email: true },
      },
      doctor: {
        select: { firstName: true, lastName: true },
      },
    },
  },
};

const userReferralIncludes = {
  consultation: {
    include: {
      doctor: {
        select: { firstName: true, lastName: true },
      },
    },
  },
};

const doctorReferralIncludes = {
  consultation: {
    include: {
      user: {
        select: { firstName: true, lastName: true, phoneNumber: true, email: true },
      },
    },
  },
};

export async function selectReferralById(referralId: number): Promise<types.ReferralRow | null> {
  return (
    withPrismaErrorHandling<types.ReferralRow | null>(() =>
      prisma.referral.findUnique({
        where: { id: referralId },
        include: referralIncludes,
      })
    ) ?? null
  );
}
export async function selectAllReferrals(): Promise<types.ReferralRow[]> {
  return await withPrismaErrorHandling<types.ReferralRow[]>(() =>
    prisma.referral.findMany({
      include: referralIncludes,
    })
  );
}

export async function selectReferralsByConsultationId(
  consultationId: number
): Promise<types.ReferralRow[]> {
  return withPrismaErrorHandling<types.ReferralRow[]>(() =>
    prisma.referral.findMany({
      where: { consultationId },
      include: referralIncludes,
    })
  );
}

export async function selectUserReferrals(userId: number): Promise<types.UserReferralRow[]> {
  return await withPrismaErrorHandling<types.UserReferralRow[]>(() =>
    prisma.referral.findMany({
      where: {
        consultation: {
          userId,
        },
      },
      include: userReferralIncludes,
    })
  );
}

export async function selectDoctorReferrals(doctorId: number): Promise<types.DoctorReferralRow[]> {
  return await withPrismaErrorHandling<types.DoctorReferralRow[]>(() =>
    prisma.referral.findMany({
      where: {
        consultation: {
          doctorId,
        },
      },
      include: doctorReferralIncludes,
    })
  );
}
