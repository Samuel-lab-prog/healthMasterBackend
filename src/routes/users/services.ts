import bcrypt from 'bcryptjs';
import { insertUser } from './models.ts';
import type { PostUser, UserRow } from './types.ts';

export async function registerUser(body: PostUser): Promise<Pick<UserRow, 'id'>> {
  const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;
  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);

  return await insertUser({
    ...body,
    password: passwordHash,
  });
}
