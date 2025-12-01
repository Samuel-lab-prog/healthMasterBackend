import { postDoctorSchema, doctorSchema, fullDoctorSchema } from './schemas.ts';

export type Doctor = (typeof doctorSchema)['static'];
export type FullDoctor = (typeof fullDoctorSchema)['static'];
export type PostDoctor = (typeof postDoctorSchema)['static'];

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
