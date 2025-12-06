import * as s from './schemas';
import type { Prisma } from '../../prisma/generated/browser';
import type { ConsultationUncheckedCreateInput } from '../../prisma/generated/models';

export type Consultation = (typeof s.consultationSchema)['static'];
export type UserConsultation = (typeof s.userConsultationSchema)['static'];
export type DoctorConsultation = (typeof s.doctorConsultationSchema)['static'];
export type PostConsultation = (typeof s.postConsultationSchema)['static'];
export type ConsultationStatus = Consultation['status'];
export type ConsultationTypes = Consultation['type'];
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

    location: row.location,
    status: row.status,
    type: row.type,
    endTime: row.endTime,
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

    location: row.location,
    status: row.status,
    type: row.type,
    endTime: row.endTime,
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

    location: row.location,
    status: row.status,
    type: row.type,
    endTime: row.endTime,
  };
}
