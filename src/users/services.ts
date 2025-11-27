import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError.ts';
import { generateUserToken, verifyUserToken, type UserPayload } from '../utils/jwt.ts';
import { insertUser, selectUserByEmail, selectUserById } from './models.ts';
import { mapFullUserToUser } from './types.ts';
import type { FullUser, PostUser, User } from './types.ts';

function ensureUserExists(user: FullUser | null): void {
  if (!user) {
    throw new AppError({
      statusCode: 404,
      errorMessages: ['User not found'],
    });
  }
}

export async function registerUser(body: PostUser): Promise<Pick<User, 'id'>> {
  const passwordHash = await bcrypt.hash(
    body.password,
    process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10
  );
  return await insertUser({
    ...body,
    passwordHash: passwordHash,
  });
}

export async function loginUser(body: {
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> {
  const user = await selectUserByEmail(body.email);
  ensureUserExists(user);

  if (!(await bcrypt.compare(body.password, user!.passwordHash))) {
    throw new AppError({
      statusCode: 401,
      errorMessages: ['Invalid credentials'],
    });
  }

  const token = generateUserToken({
    id: user!.id,
    email: user!.email,
  } as UserPayload);
  return { token, user: mapFullUserToUser(user!) };
}

export async function authenticateUser(token: string): Promise<User> {
  const payload = verifyUserToken(token) as UserPayload;

  if (!payload.id) {
    throw new AppError({
      statusCode: 401,
      errorMessages: ['Invalid token'],
    });
  }

  const user = await selectUserById(payload.id);
  return mapFullUserToUser(user!);
}
