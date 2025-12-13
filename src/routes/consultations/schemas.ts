import { t } from 'elysia';
import * as s from '../../utils/schemas.ts';

export const postConsultationSchema = t.Object({
  userId: s.idSchema,

  doctorId: s.idSchema,

  location: s.locationSchema,
  notes: s.notesSchema,
  status: s.consultationStatusSchema,
  type: s.consultationTypeSchema,
  date: s.dateSchema,
  endTime: s.dateSchema,
});

export const userConsultationSchema = t.Object({
  id: s.idSchema,

  doctorFirstName: s.firstNameSchema,
  doctorLastName: s.lastNameSchema,
  doctorSpeciality: s.doctorSpecialitySchema,

  location: s.locationSchema,
  status: s.consultationStatusSchema,
  type: s.consultationTypeSchema,
  date: s.dateSchema,
  endTime: s.dateSchema,
});

export const doctorConsultationSchema = t.Object({
  
  userId: s.idSchema,
  userFirstName: s.firstNameSchema,
  userLastName: s.lastNameSchema,
  userPhoneNumber: s.phoneNumberSchema,
  userEmail: s.emailSchema,
  
  id: s.idSchema,
  date: s.dateSchema,
  notes: s.notesSchema,
  location: s.locationSchema,
  status: s.consultationStatusSchema,
  type: s.consultationTypeSchema,
  endTime: s.dateSchema,
});
