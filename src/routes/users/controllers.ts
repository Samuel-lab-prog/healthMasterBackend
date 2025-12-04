import { Elysia, t } from 'elysia';
import { appErrorSchema } from '../../utils/AppError.ts';
import { idSchema } from '../../utils/schemas.ts';
import * as services from './services.ts';
import * as schemas from './schemas.ts';

export const userRouter = new Elysia({ prefix: '/users' })
  .post(
    '/register',
    async ({ body, set }) => {
      set.status = 201;
      return await services.registerUser(body);
    },
    {
      body: schemas.postUserSchema,
      response: {
        201: t.Object({ id: idSchema }),
        400: appErrorSchema,
        422: appErrorSchema,
        409: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Create',
        description: 'Creates a new user. Returns an object with the new user ID.',
        tags: ['Users'],
      },
    }
  );