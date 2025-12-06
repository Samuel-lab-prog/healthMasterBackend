import type { Prisma } from '../../prisma/generated/browser';
import type { UserCreateInput } from '../../prisma/generated/models';
import * as s from './schemas';

export function mapUserRowToUser(Row: UserRow): User {
  return {
    id: Row.id,
    firstName: Row.firstName,
    lastName: Row.lastName,
    cpf: Row.cpf,
    birthDate: Row.birthDate,
    email: Row.email,
    phoneNumber: Row.phoneNumber,
    createdAt: Row.createdAt,
    updatedAt: Row.updatedAt,
    role: 'user',
    sex: Row.sex,
  };
}

export type User = (typeof s.userSchema)['static'];
export type PostUser = (typeof s.postUserSchema)['static'];
export type UserRow = Prisma.UserGetPayload<object>;
export type InsertUser = UserCreateInput;
export type UniqueUserField = 'id' | 'email' | 'cpf' | 'phoneNumber';
