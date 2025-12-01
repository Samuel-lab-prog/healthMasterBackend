import bcrypt from 'bcryptjs';
import { insertUser } from './models.ts';
import type { PostUser } from './types.ts';
import type { Prisma } from '../../prisma/generated/prisma/client.ts';

type UserRow = Prisma.UserGetPayload<object>;

import { throwServerError } from '../../utils/AppError.ts';

export async function registerUser(body: PostUser): Promise<Pick<UserRow, 'id'>> {
  const passwordHash = await bcrypt.hash(
    body.password,
    process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10
  );
  const result = await insertUser({
    ...body,
    password: passwordHash,
  });

  if (!result) {
    throwServerError();
  }
  return result;
}
