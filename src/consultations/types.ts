import {
  postConsultationSchema,
  consultationSchema,
  insertConsultationSchema,
  fullConsultationSchema,
} from './schemas';

export type ConsultationRow = {
  id: number;
  user_id: number;
  doctor_id: number;
  consultation_date: Date;
  notes: string;
  created_at: Date;
  updated_at: Date | null;
};

export type Consultation = (typeof consultationSchema)['static'];
export type FullConsultation = (typeof fullConsultationSchema)['static'];
export type PostConsultation = (typeof postConsultationSchema)['static'];
export type InsertConsultation = (typeof insertConsultationSchema)['static'];

export function mapConsultationRowToFullConsultation(
  ConsultationRow: ConsultationRow
): FullConsultation {
  return {
    id: ConsultationRow.id,
    userId: ConsultationRow.user_id,
    doctorId: ConsultationRow.doctor_id,
    consultationDate: ConsultationRow.consultation_date.toISOString(),
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
