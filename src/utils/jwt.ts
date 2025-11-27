import jwt from 'jsonwebtoken';

export interface UserPayload {
  id: number;
  email: string;
}

export interface DoctorPayload {
  id: number;
  email: string;
  crm: string;
}
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export function generateUserToken(userPayload: UserPayload): string {
  const token = jwt.sign(userPayload, JWT_SECRET);
  return token;
}

export function generateDoctorToken(doctorPayload: DoctorPayload): string {
  const token = jwt.sign(doctorPayload, JWT_SECRET);
  return token;
}

export function verifyUserToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export function verifyDoctorToken(token: string): DoctorPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DoctorPayload;
  } catch {
    return null;
  }
}
