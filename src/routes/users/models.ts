import { prisma } from '../../prisma/client.ts';
import type { Prisma } from '../../generated/client.ts';
import { withPrismaErrorHandling } from '../../utils/AppError.ts';
import type { UserCreateInput } from '../../generated/models';

type UserRow = Prisma.UserGetPayload<object>;

export async function insertUser(userData: UserCreateInput): Promise<Pick<UserRow, 'id'> | null> {
  return (
    withPrismaErrorHandling<Pick<UserRow, 'id'>>(() =>
      prisma.user.create({
        data: userData,
        select: {
          id: true,
        },
      })
    ) ?? null
  );
}

export async function selectUserByField(
  field: 'email' | 'id' | 'phoneNumber' | 'cpf',
  value: string | number
): Promise<UserRow | null> {
  return withPrismaErrorHandling<UserRow>(() => prisma.user.$selectByField(field, value));
}

export async function selectAllUsers(): Promise<UserRow[] | null> {
  return withPrismaErrorHandling<UserRow[]>(() => prisma.user.findMany()) || [];
}
