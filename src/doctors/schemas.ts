import { t } from 'elysia';
import { AppError } from '../utils/AppError';

export const firstNameSchema = t.String({
  minLength: 3,
  maxLength: 30,
  example: 'David',
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['First name must be between 3 and 30 characters long'],
    });
  },
});

export const lastNameField = t.String({
  minLength: 3,
  maxLength: 30,
  example: 'Smith',
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Last name must be between 3 and 30 characters long'],
    });
  },
});

export const emailSchema = t.String({
  format: 'email',
  example: 'david@gmail.com',
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Invalid email format'],
    });
  },
});

export const passwordSchema = t.String({
  minLength: 6,
  maxLength: 30,
  example: '12345678',
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Password must be between 6 and 30 characters long'],
    });
  },
});

export const specialitySchema = t.String({
  minLength: 3,
  maxLength: 50,
  example: 'Cardiology',
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Speciality must be between 3 and 50 characters long'],
    });
  },
});

export const crmSchema = t.String({
  minLength: 5,
  maxLength: 20,
  example: '12345',
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['CRM must be between 5 and 20 characters long'],
    });
  },
});

export const phoneNumberSchema = t.String({
  minLength: 10,
  maxLength: 15,
  example: '+1234567890',
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Phone number must be between 10 and 15 characters long'],
    });
  },
});

export const doctorIdSchema = t.Number({
  minimum: 1,
  example: 7,
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['Doctor ID must be a valid number'],
    });
  },
});

export const createdAtSchema = t.Date({
  example: new Date(),
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['createdAt must be a valid date'],
    });
  },
});

export const updatedAtSchema = t.Union([t.Date(), t.Null()],{
  example: null,
  error() {
    throw new AppError({
      statusCode: 400,
      errorMessages: ['updatedAt must be a valid date or null'],
    });
  }
})

export const loginDoctorSchema = t.Object({
  email: emailSchema,
  password: passwordSchema,
});

export const postDoctorSchema = t.Object({
  firstName: firstNameSchema,
  lastName: lastNameField,
  email: emailSchema,
  speciality: specialitySchema,
  crm: crmSchema,
  password: passwordSchema,
  phoneNumber: phoneNumberSchema,
});


export const insertDoctorSchema = t.Object({
  firstName: firstNameSchema,
  lastName: lastNameField,
  email: emailSchema,
  speciality: specialitySchema,
  crm: crmSchema,
  phoneNumber: phoneNumberSchema,
  passwordHash: t.String(),
});

export const doctorSchema = t.Object({
  id: doctorIdSchema,
  firstName: firstNameSchema,
  lastName: lastNameField,
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
  speciality: specialitySchema,
  crm: crmSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const fullDoctorSchema = t.Object({
  id: doctorIdSchema,
  firstName: firstNameSchema,
  lastName: lastNameField,
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
  speciality: specialitySchema,
  crm: crmSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  passwordHash: t.String(),
});

export const tokenSchema = t.Object({
  token: t.String(),
});