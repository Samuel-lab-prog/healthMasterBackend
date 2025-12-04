import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../../utils/jwt.ts';
import { selectDoctorByField } from '../doctors/models.ts';
import { selectUserByField } from '../users/models.ts';
import type { Doctor } from '../doctors/types.ts';
import type { User } from '../users/types.ts';
import { throwUnauthorizedError } from '../../utils/AppError.ts';
import { mapDoctorRowToDoctor } from '../doctors/types.ts';
import { mapUserRowToUser } from '../users/types.ts';

export async function login(
  email: string,
  password: string
): Promise<{ data: User; token: string } | { data: Doctor; token: string }> {
  const user = await selectUserByField('email', email);

  if (user && await bcrypt.compare(password, user.password)) {
    return {
      data: mapUserRowToUser(user),
      token: generateToken({
        id: user.id,
        email: user.email,
        role: user.role as 'user',
      }),
    };
  }

  const doctor = await selectDoctorByField('email', email);

  if (doctor && await bcrypt.compare(password, doctor.password)) {
    return {
      data: mapDoctorRowToDoctor(doctor),
      token: generateToken({
        id: doctor.id,
        email: doctor.email,
        role: 'doctor',
      }),
    };
  }
  throwUnauthorizedError('Invalid email or password');
}

export async function authenticate(token: string): Promise<User | Doctor | null> {
  try {
    const payload = verifyToken(token);
    if (!payload || !payload.role || !payload.id) {
      return null;
    }
    if (payload.role === 'user') {
      const user = await selectUserByField('id', payload.id);
      return user ? mapUserRowToUser(user) : null;
    }
    if (payload.role === 'doctor' || payload.role === 'admin') {
      const doctor = await selectDoctorByField('id', payload.id);
      return doctor ? mapDoctorRowToDoctor(doctor) : null;
    }
    return null;
  } catch {
    return null;
  }
}
