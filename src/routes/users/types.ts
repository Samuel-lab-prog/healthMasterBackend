import { postUserSchema, userSchema, fullUserSchema } from './schemas';

export function mapFullUserToUser(fullUser: FullUser): User {
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
  };
}

export type User = (typeof userSchema)['static'];
export type FullUser = (typeof fullUserSchema)['static'];
export type PostUser = (typeof postUserSchema)['static'];
