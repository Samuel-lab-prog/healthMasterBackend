import type { Prisma } from '../../prisma/generated/prisma-client/browser';
import type { DoctorCreateInput } from '../../prisma/generated/prisma-client/models';

import {
  doctorSchema,
  postDoctorSchema,
} from './schemas';

export function mapDoctorRowToDoctor(fullDoctor: DoctorRow): Doctor {
  return {
    id: fullDoctor.id,
    firstName: fullDoctor.firstName,
    lastName: fullDoctor.lastName,
    email: fullDoctor.email,
    birthDate: fullDoctor.birthDate,
    cpf: fullDoctor.cpf,
    phoneNumber: fullDoctor.phoneNumber,
    speciality: fullDoctor.speciality,
    role: fullDoctor.role,
    crm: fullDoctor.crm,
    createdAt: fullDoctor.createdAt,
    updatedAt: fullDoctor.updatedAt, 
  };
}

export function mapDoctorRowToFullDoctor(fullDoctor: DoctorRow): Doctor {
  return {
    id: fullDoctor.id,
    firstName: fullDoctor.firstName,
    lastName: fullDoctor.lastName,
    email: fullDoctor.email,
    birthDate: fullDoctor.birthDate,
    cpf: fullDoctor.cpf,
    phoneNumber: fullDoctor.phoneNumber,
    speciality: fullDoctor.speciality,
    role: fullDoctor.role,
    crm: fullDoctor.crm,
    createdAt: fullDoctor.createdAt,
    updatedAt: fullDoctor.updatedAt, 
  };
}

export type Doctor = (typeof doctorSchema)['static'];
export type PostDoctor = (typeof postDoctorSchema)['static'];
export type DoctorRow = Prisma.DoctorGetPayload<object>;
export type UniqueDoctorField = 'id' | 'email' | 'cpf' | 'phoneNumber' | 'crm';
export type InsertDoctor = DoctorCreateInput;
