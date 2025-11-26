import { AppError } from '../utils/AppError.ts';
import { mapFullConsultationToConsultation } from './types.ts';
import { insertConsultation, selectConsultationById } from './models.ts';
import type { FullConsultation, PostConsultation, Consultation } from './types.ts';

function ensureConsultationExists(Consultation: FullConsultation | null): void {
  if (!Consultation) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['Consultation not found'],
    });
  }
}

export async function registerConsultation(body: PostConsultation): Promise<Pick<Consultation, 'id'>> {
  return await insertConsultation( body);
}

export async function getConsultationById(id: number): Promise<Consultation> {
  const Consultation = await selectConsultationById(id);
  ensureConsultationExists(Consultation);
  return mapFullConsultationToConsultation(Consultation!);
}