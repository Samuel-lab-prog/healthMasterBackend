import { prisma } from '../../prisma/client.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import type { UserRow, InsertUser } from './types.ts';

export async function insertUser(userData: InsertUser): Promise<Pick<UserRow, 'id'>> {
  return (
    withPrismaErrorHandling<Pick<UserRow, 'id'>>(() =>
      prisma.user.create({
        data: userData,
        select: {
          id: true,
        },
      })
    )
  );
}

export async function selectUserByField(
  field: 'email' | 'id' | 'phoneNumber' | 'cpf',
  value: string | number
): Promise<UserRow | null> {
  return withPrismaErrorHandling<UserRow | null>(() => prisma.user.$selectByField(field, value));
}

export async function selectAllUsers(): Promise<UserRow[]> {
  return withPrismaErrorHandling<UserRow[]>(() => prisma.user.findMany());
}
