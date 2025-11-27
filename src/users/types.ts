import { postUserSchema, insertUserSchema, userSchema, fullUserSchema } from './schemas';

export type UserRow = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_admin: boolean;
  cpf: string;
  birth_date: string;
  created_at: Date;
  updated_at: Date | null;
  password_hash: string;
};

export type User = (typeof userSchema)['static'];
export type FullUser = (typeof fullUserSchema)['static'];
export type PostUser = (typeof postUserSchema)['static'];
export type InsertUser = (typeof insertUserSchema)['static'];

export function mapUserRowToFullUser(userRow: UserRow): FullUser {
  return {
    id: userRow.id,
    firstName: userRow.first_name,
    lastName: userRow.last_name,
    email: userRow.email,
    phoneNumber: userRow.phone_number,
    createdAt: userRow.created_at,
    updatedAt: userRow.updated_at ? userRow.updated_at : null,
    passwordHash: userRow.password_hash,
    cpf: userRow.cpf,
    birthDate: userRow.birth_date,
  };
}

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
