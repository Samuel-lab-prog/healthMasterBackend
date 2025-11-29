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

export const loginUserSchema = t.Object({
  email: emailSchema,
  password: passwordSchema,
});

export const postUserSchema = t.Object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
  phoneNumber: phoneNumberSchema,
  cpf: cpfSchema,
  birthDate: stringDateSchema,
});

export const insertUserSchema = t.Object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
  passwordHash: t.String(),
  cpf: cpfSchema,
  birthDate: stringDateSchema,
});

export const userSchema = t.Object({
  id: idSchema,
  cpf: cpfSchema,
  birthDate: stringDateSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const fullUserSchema = t.Object({
  id: idSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  cpf: cpfSchema,
  birthDate: stringDateSchema,
  passwordHash: t.String(),
});
