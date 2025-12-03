import type { Prisma } from '../../prisma/generated/prisma-client/browser';
import type { UserCreateInput } from '../../prisma/generated/prisma-client/models';
import { postUserSchema, userSchema } from './schemas';

export function mapUserRowToUser(fullUser: UserRow): User {
  return {
    id: fullUser.id,
    firstName: fullUser.firstName,
    lastName: fullUser.lastName,
    cpf: fullUser.cpf,
    birthDate: fullUser.birthDate,
    email: fullUser.email,
    phoneNumber: fullUser.phoneNumber,
    createdAt: fullUser.createdAt,
    updatedAt: fullUser.updatedAt,
    role: 'user',
  };
}

export type User = (typeof userSchema)['static'];
export type PostUser = (typeof postUserSchema)['static'];
export type UserRow = Prisma.UserGetPayload<object>;
export type InsertUser = UserCreateInput;
export type UniqueUserField = 'id' | 'email' | 'cpf' | 'phoneNumber';