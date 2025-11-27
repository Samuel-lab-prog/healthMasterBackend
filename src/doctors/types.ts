import { postDoctorSchema, insertDoctorSchema, doctorSchema, fullDoctorSchema } from './schemas.ts';

export type DoctorRow = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  phone_number: string;
  is_admin: boolean;
  birth_date: string;
  created_at: Date;
  updated_at: Date | null;
  role: 'doctor' | 'admin';
  password_hash: string;
  speciality: string;
  crm: string;
};

export type Doctor = (typeof doctorSchema)['static'];
export type FullDoctor = (typeof fullDoctorSchema)['static'];
export type PostDoctor = (typeof postDoctorSchema)['static'];
export type InsertDoctor = (typeof insertDoctorSchema)['static'];

export function mapDoctorRowToFullDoctor(doctorRow: DoctorRow): FullDoctor {
  return {
    id: doctorRow.id,
    firstName: doctorRow.first_name,
    role: doctorRow.role as 'doctor' | 'admin',
    lastName: doctorRow.last_name,
    email: doctorRow.email,
    cpf: doctorRow.cpf,
    phoneNumber: doctorRow.phone_number,
    speciality: doctorRow.speciality,
    crm: doctorRow.crm,
    birthDate: doctorRow.birth_date,
    createdAt: doctorRow.created_at,
    updatedAt: doctorRow.updated_at ? doctorRow.updated_at : null,
    passwordHash: doctorRow.password_hash,
  };
}

export function mapFullDoctorToDoctor(fullDoctor: FullDoctor): Doctor {
  return {
    id: fullDoctor.id,
    firstName: fullDoctor.firstName,
    lastName: fullDoctor.lastName,
    cpf: fullDoctor.cpf,
    email: fullDoctor.email,
    phoneNumber: fullDoctor.phoneNumber,
    birthDate: fullDoctor.birthDate,
    role: fullDoctor.role,
    speciality: fullDoctor.speciality,
    crm: fullDoctor.crm,
    createdAt: fullDoctor.createdAt,
    updatedAt: fullDoctor.updatedAt,
  };
}
