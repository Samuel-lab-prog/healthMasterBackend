import { t } from 'elysia';
import {
  idSchema,
  createdAtSchema,
  stringDateSchema,
  updatedAtSchema,
  emailSchema,
  passwordSchema,
  phoneNumberSchema,
  cpfSchema,
  firstNameSchema,
  lastNameSchema,
} from '../../utils/schemas.ts';
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
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  cpf: cpfSchema,
  birthDate: stringDateSchema,
  email: emailSchema,
  speciality: specialitySchema,
  crm: crmSchema,
  password: passwordSchema,
  phoneNumber: phoneNumberSchema,
  role: roleSchema,
});

export const doctorSchema = t.Object({
  id: idSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  birthDate: stringDateSchema,
  cpf: cpfSchema,
  phoneNumber: phoneNumberSchema,
  speciality: specialitySchema,
  role: roleSchema,
  crm: crmSchema,

  createdAt: createdAtSchema,

  updatedAt: t.Union([updatedAtSchema, t.Null()]),
});
