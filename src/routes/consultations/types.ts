import {
  postConsultationSchema,
  consultationSchema,
  userConsultationSchema,
  doctorConsultationSchema,
} from './schemas';
import type { Prisma } from '../../prisma/generated/prisma-client/browser';
import type { ConsultationUncheckedCreateInput } from '../../prisma/generated/prisma-client/models';

export type Consultation = (typeof consultationSchema)['static'];
export type UserConsultation = (typeof userConsultationSchema)['static'];
export type DoctorConsultation = (typeof doctorConsultationSchema)['static'];
export type PostConsultation = (typeof postConsultationSchema)['static'];

export type InsertConsultation = ConsultationUncheckedCreateInput;

export type UserConsultationRow = Prisma.ConsultationGetPayload<{
  include: {
    doctor: {
      select: {
        firstName: true;
        lastName: true;
        speciality: true;
      };
    };
  };
}>;

export type DoctorConsultationRow = Prisma.ConsultationGetPayload<{
  include: {
    user: {
      select: {
        firstName: true;
        lastName: true;
        phoneNumber: true;
        email: true;
      };
    };
  };
}>;

export type ConsultationRow = Prisma.ConsultationGetPayload<{
  include: {
    user: { select: { firstName: true; lastName: true } };
    doctor: { select: { firstName: true; lastName: true } };
  };
}>;

export function mapConsultationRowToConsultation(row: ConsultationRow): Consultation {
  return {
    id: row.id,
    userFullName: `${row.user.firstName} ${row.user.lastName}`,
    doctorFullName: `${row.doctor.firstName} ${row.doctor.lastName}`,
    date: row.date,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapUserConsultationRowToUserConsultation(
  row: UserConsultationRow
): UserConsultation {
  return {
    id: row.id,
    date: row.date,
    notes: row.notes,
    doctorId: row.doctorId,
    doctorName: `${row.doctor.firstName} ${row.doctor.lastName}`,
    doctorSpeciality: row.doctor.speciality,
  };
}

export function mapDoctorConsultationRowToDoctorConsultation(
  row: DoctorConsultationRow
): DoctorConsultation {
  return {
    id: row.id,
    date: row.date,
    notes: row.notes,
    userId: row.userId,
    userName: `${row.user.firstName} ${row.user.lastName}`,
    userPhoneNumber: row.user.phoneNumber,
    userEmail: row.user.email,
  };
}
