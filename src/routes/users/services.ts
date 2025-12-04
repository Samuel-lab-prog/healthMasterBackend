import bcrypt from 'bcryptjs';
import * as models from './models.ts';
import * as types from './types.ts';

export async function registerUser(body: types.PostUser): Promise<Pick<types.UserRow, 'id'>> {
  const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;
  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);

  return await models.insertUser({
    ...body,
    password: passwordHash,
  });
}
