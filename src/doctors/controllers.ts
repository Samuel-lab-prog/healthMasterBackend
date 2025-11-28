import { Elysia, t } from 'elysia';
import { errorSchema } from '../utils/AppError.ts';
import {
  registerDoctor,
  loginDoctor,
  authenticateAdmin,
  authenticateDoctor,
  getAllDoctors,
} from './services.ts';
import { postDoctorSchema, loginDoctorSchema, doctorSchema } from './schemas.ts';
import { idSchema, tokenSchema } from '../utils/schemas.ts';

export const doctorRouter = (app: Elysia) =>
  app.group('/doctors', (app) =>
    app
      .post(
        '/login',
        async ({ body, set, cookie }) => {
          const { token, doctor } = await loginDoctor(body);

          cookie.token!.path = '/';
          cookie.token!.httpOnly = true;
          cookie.token!.sameSite = 'lax';
          cookie.token!.value = token;

          set.status = 200;
          return doctor;
        },
        {
          body: loginDoctorSchema,
          response: {
            200: doctorSchema,
            401: errorSchema,
            422: errorSchema,
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
      .get(
        '/',
        async () => {
          return await getAllDoctors();
        },
        {
          response: {
            200: t.Array(doctorSchema),
            404: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Get All Doctors',
            description: 'Retrieves a list of all Doctors.',
            tags: ['Doctor'],
          },
        }
      )
      .state('doctorId', 0)
      .guard({
        // All routes below require doctor login authentication
        cookie: tokenSchema,
        response: {
          400: errorSchema,
          401: errorSchema,
          500: errorSchema,
        },
        beforeHandle: async ({ cookie, store }) => {
          const doctor = await authenticateDoctor(cookie.token.value);
          store.doctorId = doctor.id;
        },
      })
      .guard({
        // All routes below require admin authentication
        response: {
          403: errorSchema,
        },
        beforeHandle: async ({ store }) => {
          await authenticateAdmin(store.doctorId);
        },
      })
      .post(
        '/register',
        async ({ body, set }) => {
          set.status = 201;
          return await registerDoctor(body);
        },
        {
          body: postDoctorSchema,
          response: {
            201: t.Object({ id: idSchema }),
            409: errorSchema,
          },
          detail: {
            summary: 'Register',
            description:
              'Creates a new Doctor. Returns an object with the new Doctor ID. Requires login and admin authentication.',
            tags: ['Doctor'],
          },
        }
      )
  );
