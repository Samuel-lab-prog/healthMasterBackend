import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt.ts';
import { selectDoctorByField } from '../doctors/models.ts';
import { selectUserByEmail } from '../users/models.ts';
import type { Doctor } from '../doctors/types.ts';
import type { User } from '../users/types.ts';
import { throwUnauthorizedError } from '../../utils/AppError.ts';
import { mapFullDoctorToDoctor } from '../doctors/types.ts';
import { mapFullUserToUser } from '../users/types.ts';

export async function login(
  email: string,
  password: string
): Promise<
  { type: 'user'; data: User; token: string } | { type: 'doctor'; data: Doctor; token: string }
> {
  const user = await selectUserByEmail(email);

  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    return {
      type: 'user',
      data: mapFullUserToUser(user),
      token: generateToken({
        id: user.id,
        email: user.email,
        role: 'user',
      }),
    };
  }

  const doctor = await selectDoctorByField('email', email);

  if (doctor && bcrypt.compareSync(password, doctor.passwordHash)) {
    return {
      type: 'doctor',
      data: mapFullDoctorToDoctor(doctor),
      token: generateToken({
        id: doctor.id,
        email: doctor.email,
        role: 'doctor',
      }),
    };
  }

  throwUnauthorizedError('Invalid email or password');
}
