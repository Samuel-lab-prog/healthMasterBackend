/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma-client/client.ts';

const connectionString = `${process.env.TEST_DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
export const p = new PrismaClient({ adapter, errorFormat: 'pretty' });

export const prisma = p.$extends({
  model: {
    $allModels: {
      async $selectByField(this: any, field: string, value: string | number) {
        return this.findFirst({
          where: {
            [field]: value,
          },
        });
      },
    },
  },
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user: { firstName: string; lastName: string }) {
          return `${user.firstName} ${user.lastName}`;
        },
      },
    },
    doctor: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user: { firstName: string; lastName: string }) {
          return `${user.firstName} ${user.lastName}`;
        },
      },
    },
  },
});
