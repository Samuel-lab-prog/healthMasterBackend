import { Elysia, t } from 'elysia';
import { appErrorSchema } from '../../utils/AppError.ts';
import { registerUser } from './services.ts';
import { postUserSchema } from './schemas.ts';
import { idSchema } from '../../utils/schemas.ts';

export const userRouter = (app: Elysia) =>
  app.group('/users', (app) =>
    app.post(
      '/register',
      async ({ body, set }) => {
        set.status = 201;
        return await registerUser(body);
      },
      {
        body: postUserSchema,
        response: {
          201: t.Object({ id: idSchema }),
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
