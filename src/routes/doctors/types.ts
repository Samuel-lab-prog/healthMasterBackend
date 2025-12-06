import type { Prisma } from '../../prisma/generated/browser';
import type { DoctorCreateInput } from '../../prisma/generated/models';

import { doctorSchema, postDoctorSchema } from './schemas';

export type Doctor = (typeof doctorSchema)['static'];
export type PostDoctor = (typeof postDoctorSchema)['static'];
export type DoctorRow = Prisma.DoctorGetPayload<object>;
export type UniqueDoctorField = 'id' | 'email' | 'cpf' | 'phoneNumber' | 'crm';
export type InsertDoctor = DoctorCreateInput;

export function mapDoctorRowToDoctor(row: DoctorRow): Doctor {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    birthDate: row.birthDate,
    cpf: row.cpf,
    phoneNumber: row.phoneNumber,
    speciality: row.speciality,
    role: row.role,
    crm: row.crm,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    sex: row.sex,
  };
}
