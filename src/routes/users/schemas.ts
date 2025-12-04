import { t } from 'elysia';
import * as s from '../../utils/schemas.ts';

export const postUserSchema = t.Object({
  firstName: s.firstNameSchema,
  lastName: s.lastNameSchema,
  email: s.emailSchema,
  password: s.passwordSchema,
  phoneNumber: s.phoneNumberSchema,
  cpf: s.cpfSchema,
  birthDate: s.DateSchema,
});

export const userSchema = t.Object({
  firstName: s.firstNameSchema,
  lastName: s.lastNameSchema,
  email: s.emailSchema,
  phoneNumber: s.phoneNumberSchema,
  cpf: s.cpfSchema,
  birthDate: s.DateSchema,
  id: s.idSchema,
  createdAt: s.createdAtSchema,
  updatedAt: s.updatedAtSchema,
  role: t.Literal('user'),
});
