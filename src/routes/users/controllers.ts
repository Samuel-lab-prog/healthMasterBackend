import { Elysia, t } from 'elysia';
import { appErrorSchema } from '../../utils/AppError.ts';
import { registerUser } from './services.ts';
import { postUserSchema } from './schemas.ts';
import { idSchema } from '../../utils/schemas.ts';

import { UserPlain, UserPlainInputCreate } from '../../generated/prismabox/User'

export const userRouter = (app: Elysia) =>
  app.group('/users', (app) =>
    app.post(
      '/register',
      async ({ body, set }) => {
        set.status = 201;
        return await registerUser(body);
      },
      {
        body: UserPlainInputCreate,
        response: {
          201: t.Object({ id: idSchema }),
          400: appErrorSchema,
          422: appErrorSchema,
          409: appErrorSchema,
          500: appErrorSchema,
        },
        detail: {
          summary: 'Register',
          description: 'Creates a new user. Returns an object with the new user ID.',
          tags: ['Users'],
        },
      }
    )
  );
