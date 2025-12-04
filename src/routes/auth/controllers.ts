import { Elysia, t } from 'elysia';
import { appErrorSchema } from '../../utils/AppError.ts';
import { loginSchema } from '../../utils/schemas.ts';
import { userSchema } from '../users/schemas.ts';
import { doctorSchema } from '../doctors/schemas.ts';
import { login } from './services.ts';

export const authRouter = new Elysia()
  .group('/auth', (app) =>
    app.post(
      '/login',
      async ({ body, cookie }) => {
        const result = await login(body.email, body.password);

        cookie.token!.value = result.token;
        cookie.token!.httpOnly = true;
        cookie.token!.path = '/';
        cookie.token!.secure = true;

        return result.data;
      },
      {
        body: loginSchema,
        response: {
          200: t.Union([userSchema, doctorSchema]),
          400: appErrorSchema,
          401: appErrorSchema,
          422: appErrorSchema,
          500: appErrorSchema,
        },
        detail: {
          summary: 'Login',
          description: 'Authenticates a user or doctor and returns their data along with a token.',
          tags: ['Auth'],
        },
      }
    )
  );
