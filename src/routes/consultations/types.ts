import {
  postConsultationSchema,
  consultationSchema,
  insertConsultationSchema,
  fullConsultationSchema,
  userConsultationSchema,
  doctorConsultationSchema,
} from './schemas';

export type ConsultationRow = {
  id: number;
  user_id: number;
  doctor_id: number;
  date: string;
  notes: string;
  created_at: Date;
  updated_at: string | null;
};

export type UserConsultationRow = {
  id: number;
  date: string;
  notes: string;
  doctor_id: number;
  doctor_name: string;
  doctor_speciality: string;
};

export type DoctorConsultationRow = {
  id: number;
  date: string;
  notes: string;
  user_id: number;
  user_name: string;
};

export type Consultation = (typeof consultationSchema)['static'];
export type FullConsultation = (typeof fullConsultationSchema)['static'];
export type PostConsultation = (typeof postConsultationSchema)['static'];
export type InsertConsultation = (typeof insertConsultationSchema)['static'];
export type UserConsultation = (typeof userConsultationSchema)['static'];
export type DoctorConsultation = (typeof doctorConsultationSchema)['static'];

export function mapConsultationRowToFullConsultation(
  ConsultationRow: ConsultationRow
): FullConsultation {
  return {
    id: ConsultationRow.id,
    userId: ConsultationRow.user_id,
    doctorId: ConsultationRow.doctor_id,
    consultationDate: ConsultationRow.date,
    notes: ConsultationRow.notes,
    createdAt: ConsultationRow.created_at,
    updatedAt: ConsultationRow.updated_at ? ConsultationRow.updated_at : null,
  };
}

export function mapFullConsultationToConsultation(
  fullConsultation: FullConsultation
): Consultation {
  return {
    id: fullConsultation.id,
    userId: fullConsultation.userId,
    doctorId: fullConsultation.doctorId,
    consultationDate: fullConsultation.consultationDate,
    notes: fullConsultation.notes,
    createdAt: fullConsultation.createdAt,
    updatedAt: fullConsultation.updatedAt,
  };
}

export function mapUserConsultationRowToUserConsultation(
  row: UserConsultationRow
): UserConsultation {
  return {
    id: row.id,
    date: row.date,
    notes: row.notes,
    doctorId: row.doctor_id,
    doctorName: row.doctor_name,
    doctorSpeciality: row.doctor_speciality,
  };
}

export function mapDoctorConsultationRowToDoctorConsultation(
  row: DoctorConsultationRow
): DoctorConsultation {
  return {
    id: row.id,
    date: row.date,
    notes: row.notes,
    userId: row.user_id,
    userName: row.user_name,
  };
}
