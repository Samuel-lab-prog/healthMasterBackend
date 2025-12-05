import { t } from 'elysia';
import * as s from '../../utils/schemas.ts';

export const postDoctorSchema = t.Object({
  firstName: s.firstNameSchema,
  lastName: s.lastNameSchema,
  cpf: s.cpfSchema,
  birthDate: s.DateSchema,
  email: s.emailSchema,
  speciality: s.doctorSpecialitySchema,
  crm: s.doctorCrmSchema,
  password: s.passwordSchema,
  phoneNumber: s.phoneNumberSchema,
  role: s.doctorRoleSchema,
  sex: s.sexSchema,
  createdById: s.idSchema,
});

export const doctorSchema = t.Object({
  id: s.idSchema,
  firstName: s.firstNameSchema,
  lastName: s.lastNameSchema,
  email: s.emailSchema,
  birthDate: s.DateSchema,
  cpf: s.cpfSchema,
  phoneNumber: s.phoneNumberSchema,
  speciality: s.doctorSpecialitySchema,
  role: s.doctorRoleSchema,
  crm: s.doctorCrmSchema,
  sex: s.sexSchema,
  createdAt: s.DateSchema,
  updatedAt: s.DateSchema,
});
