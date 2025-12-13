import * as s from './schemas';
import type { Prisma } from '../../prisma/generated/browser';
import type { ConsultationUncheckedCreateInput } from '../../prisma/generated/models';

export type UserConsultation = (typeof s.userConsultationSchema)['static'];
export type DoctorConsultation = (typeof s.doctorConsultationSchema)['static'];
export type PostConsultation = (typeof s.postConsultationSchema)['static'];

export type ConsultationStatus = DoctorConsultation['status'];
export type ConsultationType = DoctorConsultation['type'];
export type InsertConsultation = ConsultationUncheckedCreateInput;

export const userInclude = {
  select: {
    firstName: true,
    lastName: true,
    phoneNumber: true,
    email: true,
    id: true,
  },
};

export const doctorInclude = {
  select: {
    firstName: true,
    lastName: true,
    speciality: true,
  },
};

export const consultationIncludes = {
  user: userInclude,
  doctor: doctorInclude,
};

// I'm using a unique consultation row to simplify queries. It may be separated later if needed for optimization.
export type ConsultationRow = Prisma.ConsultationGetPayload<{
  include: {
    user: { select: { firstName: true; lastName: true, id: true, phoneNumber: true, email: true } };
    doctor: { select: { firstName: true; lastName: true, speciality: true } };
  };
}>;

export function toUserConsultationView(
  row: ConsultationRow
): UserConsultation {
  return {
    doctorFirstName: row.doctor.firstName,
    doctorLastName: row.doctor.lastName,
    doctorSpeciality: row.doctor.speciality,

    id: row.id,
    date: row.date,
    location: row.location,
    status: row.status,
    type: row.type,
    endTime: row.endTime,
  };
}

export function toDoctorConsultationView(
  row: ConsultationRow
): DoctorConsultation {
  return {
    id: row.id,

    userId: row.user.id,
    userFirstName: row.user.firstName,
    userLastName: row.user.lastName,
    userPhoneNumber: row.user.phoneNumber,
    userEmail: row.user.email,

    date: row.date,
    notes: row.notes,
    location: row.location,
    status: row.status,
    type: row.type,
    endTime: row.endTime,
  };
}

