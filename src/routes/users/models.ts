import { prisma } from '../../prisma/client.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import type { UserRow, InsertUser, UniqueUserField } from './types.ts';

export async function insertUser(userData: InsertUser): Promise<Pick<UserRow, 'id'>> {
  return withPrismaErrorHandling<Pick<UserRow, 'id'>>(() =>
    prisma.user.create({
      data: userData,
      select: {
        id: true,
      },
    })
  );
}

export async function selectUserByField<K extends UniqueUserField>(
  field: K,
  value: UserRow[K]
): Promise<UserRow | null> {
  return withPrismaErrorHandling(() =>
    prisma.user.findFirst({
      where: { [field]: value },
    })
  );
}

export async function selectAllUsers(): Promise<UserRow[]> {
  return withPrismaErrorHandling<UserRow[]>(() => prisma.user.findMany());
}
