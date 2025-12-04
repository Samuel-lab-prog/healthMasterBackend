import { t } from 'elysia';
import * as s from '../../utils/schemas.ts';
import { makeValidationError } from '../../utils/AppError.ts';

export const roleSchema = t.UnionEnum(['doctor', 'admin'], {
  example: 'doctor',
  ...makeValidationError('Role must be either doctor or admin'),
});

export const specialitySchema = t.String({
  minLength: 3,
  maxLength: 50,
  example: 'Cardiology',
  ...makeValidationError('Speciality must be between 3 and 50 characters long'),
});

export const crmSchema = t.String({
  minLength: 5,
  maxLength: 20,
  example: '12345',
  ...makeValidationError('CRM must be between 5 and 20 characters long'),
});

export const postDoctorSchema = t.Object({
  firstName: s.firstNameSchema,
  lastName: s.lastNameSchema,
  cpf: s.cpfSchema,
  birthDate: s.stringDateSchema,
  email: s.emailSchema,
  speciality: specialitySchema,
  crm: crmSchema,
  password: s.passwordSchema,
  phoneNumber: s.phoneNumberSchema,
  role: roleSchema,
});

export const doctorSchema = t.Object({
  id: s.idSchema,
  firstName: s.firstNameSchema,
  lastName: s.lastNameSchema,
  email: s.emailSchema,
  birthDate: s.stringDateSchema,
  cpf: s.cpfSchema,
  phoneNumber: s.phoneNumberSchema,
  speciality: specialitySchema,
  role: roleSchema,
  crm: crmSchema,

  createdAt: s.createdAtSchema,

  updatedAt: s.updatedAtSchema,
});
