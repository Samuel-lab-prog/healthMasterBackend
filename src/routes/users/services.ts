import bcrypt from 'bcryptjs';
import { insertUser } from './models.ts';
import type { PostUser, User } from './types.ts';

import { throwServerError } from '../../utils/AppError.ts';

export async function registerUser(body: PostUser): Promise<Pick<User, 'id'>> {
  const passwordHash = await bcrypt.hash(
    body.password,
    process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10
  );

  const result = await insertUser({
    ...body,
    passwordHash: passwordHash,
  });

  if (!result) {
    throwServerError();
  }
  return result;
}
