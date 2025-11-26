import { Elysia, t } from 'elysia';
import { errorSchema } from '../utils/AppError.ts';
import {
  registerDoctor,
  loginDoctor,
  authenticateDoctor,
} from './services.ts';
import {
  postDoctorSchema,
  loginDoctorSchema,
  doctorSchema,
  tokenSchema,
} from './schemas.ts';


export const doctorRouter = (app: Elysia) =>
  app.group('/Doctors', (app) =>
    app
      .post(
        '/register',
        async ({ body, set }) => {
          const Doctor = await registerDoctor(body);
          set.status = 201;
          return Doctor;
        },
        {
          body: postDoctorSchema,
          response: {
            201: t.Object({ id: t.Number() }),
            400: errorSchema,
            409: errorSchema,
            410: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Register',
            description: 'Creates a new Doctor. Returns an object with the new Doctor ID.',
            tags: ['Doctor'],
          },
        }
      )
      .post(
        '/login',
        async ({ body, set, cookie }) => {
          const { token, Doctor } = await loginDoctor(body);

          cookie.token!.path = '/';
          cookie.token!.httpOnly = true;
          cookie.token!.sameSite = 'lax';
          cookie.token!.value = token;

          set.status = 200;
          return Doctor;
        },
        {
          body: loginDoctorSchema,
          response: {
            200: doctorSchema,
            400: errorSchema,
            401: errorSchema,
            410: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Login',
            description:
              "Authenticates the Doctor, returns it's info and sets a JWT token in a cookie.",
            tags: ['Doctor'],
          },
        }
      )
      .state('DoctorId', 0)
      .guard({
        // All routes below require login authentication
        cookie: tokenSchema,
        beforeHandle: async ({ cookie, store }) => {
          store.DoctorId = (await authenticateDoctor(cookie.token.value)).id;
        }
      }
      )
  );