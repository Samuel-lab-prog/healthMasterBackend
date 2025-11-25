import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError.ts';
import { mapFullUserToUser } from './types.ts';
import { generateToken, verifyToken, type Payload } from '../utils/jwt.ts';
import {
  insertUser,
  selectUserByEmail,
  selectUserById,
  deleteUser,
} from './models.ts';
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

  const token = generateToken({
    id: user!.id,
    email: user!.email,
  } as Payload);
  ensureUserExists(user);
  return { token, user: mapFullUserToUser(user!) };
}

export async function authenticateUser(token: string): Promise<User> {
  const payload = verifyToken(token) as Payload;
  const user = await selectUserById(payload.id);
  ensureUserExists(user);
  return mapFullUserToUser(user!);
}



export async function removeUser(userId: number): Promise<User> {
  const deletedUser = await deleteUser(userId);
  ensureUserExists(deletedUser);
  return mapFullUserToUser(deletedUser!);
}

export async function isAdmin(userId: number): Promise<User> {
  const user = await selectUserById(userId);
  ensureUserExists(user);
  const isAdmin = user!.isAdmin;
  if (!isAdmin) {
    throw new AppError({
      statusCode: 403,
      errorMessages: ['User is not an admin'],
    });
  }
  return mapFullUserToUser(user!);
}