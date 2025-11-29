import bcrypt from 'bcryptjs';
import { generateUserToken, verifyUserToken, type UserPayload } from '../../utils/jwt.ts';
import { insertUser, selectUserByEmail, selectUserById } from './models.ts';
import { mapFullUserToUser } from './types.ts';
import type { PostUser, User } from './types.ts';

import {
  throwNotFoundError,
  throwServerError,
  throwUnauthorizedError,
} from '../../utils/AppError.ts';

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

export async function loginUser(body: {
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> {
  const user = await selectUserByEmail(body.email);

  if (!user) {
    throwNotFoundError('User not found with provided email');
  }

  if (!(await bcrypt.compare(body.password, user!.passwordHash))) {
    throwUnauthorizedError('Invalid credentials');
  }

  const token = generateUserToken({
    id: user.id,
    email: user.email,
  } as UserPayload);

  return { token, user: mapFullUserToUser(user) };
}

export async function authenticateUser(token: string): Promise<User> {
  const payload = verifyUserToken(token) as UserPayload;

  if (!payload.id) {
    throwUnauthorizedError('Invalid token');
  }

  const user = await selectUserById(payload.id);
  return mapFullUserToUser(user!); // User existence already verified in verifyUserToken
}
