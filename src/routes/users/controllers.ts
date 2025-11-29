import { Elysia, t } from 'elysia';
import { appErrorSchema } from '../../utils/schemas.ts';
import { registerUser, loginUser } from './services.ts';
import { postUserSchema, loginUserSchema, userSchema } from './schemas.ts';
import { idSchema } from '../../utils/schemas.ts';

export const userRouter = (app: Elysia) =>
  app.group('/users', (app) =>
    app
      .post(
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
      .post(
        '/login',
        async ({ body, cookie }) => {
          const { token, user } = await loginUser(body);
          cookie.token!.path = '/';
          cookie.token!.httpOnly = true;
          cookie.token!.sameSite = 'lax';
          cookie.token!.value = token;

          return user;
        },
        {
          body: loginUserSchema,
          response: {
            200: userSchema,
            422: appErrorSchema,
            401: appErrorSchema,
            500: appErrorSchema,
          },
          detail: {
            summary: 'Login',
            description:
              "Authenticates the user, returns it's info and sets a JWT token in a cookie.",
            tags: ['Users'],
          },
        }
      )
  );
