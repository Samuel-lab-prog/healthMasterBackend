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

export const postUserSchema = t.Object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
  phoneNumber: phoneNumberSchema,
  cpf: cpfSchema,
  birthDate: stringDateSchema,
});

export const userSchema = t.Object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
  cpf: cpfSchema,
  birthDate: stringDateSchema,

  id: idSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  role: t.Literal('user'),
});
