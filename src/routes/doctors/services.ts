import bcrypt from 'bcryptjs';
import * as models from './models.ts';
import * as types from './types.ts';

export async function registerDoctor(body: types.PostDoctor): Promise<Pick<types.DoctorRow, 'id'>> {
  const saltRounds = Number(process.env.SALT_ROUNDS ?? 10);

  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  return models.insertDoctor({
    ...body,
    password: passwordHash,
  });
}

export async function getAllDoctors(): Promise<types.Doctor[]> {
  const doctors = await models.selectAllDoctors();
  return doctors.map(types.mapDoctorRowToDoctor);
}
