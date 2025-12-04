import { prisma } from '../../prisma/client.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import * as types from './types.ts';

export async function insertUser(userData: types.InsertUser): Promise<Pick<types.UserRow, 'id'>> {
  return withPrismaErrorHandling<Pick<types.UserRow, 'id'>>(() =>
    prisma.user.create({
      data: userData,
      select: {
        id: true,
      },
    })
  );
}

export async function selectUserByField<K extends types.UniqueUserField>(
  field: K,
  value: types.UserRow[K]
): Promise<types.UserRow | null> {
  return withPrismaErrorHandling(() =>
    prisma.user.findFirst({
      where: { [field]: value },
    })
  );
}

export async function selectAllUsers(): Promise<types.UserRow[]> {
  return withPrismaErrorHandling<types.UserRow[]>(() => prisma.user.findMany());
}
