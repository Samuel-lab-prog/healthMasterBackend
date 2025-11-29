import { Elysia, t } from 'elysia';
import { appErrorSchema } from '../../utils/schemas.ts';
import {
  registerDoctor,
  loginDoctor,
  authenticateAdmin,
  authenticateDoctor,
  getAllDoctors,
} from './services.ts';
import { postDoctorSchema, loginDoctorSchema, doctorSchema } from './schemas.ts';
import { idSchema, tokenSchema } from '../../utils/schemas.ts';

export const doctorRouter = (app: Elysia) =>
  app.group('/doctors', (app) =>
    app
      .post(
        '/login',
        async ({ body, cookie }) => {
          const { token, doctor } = await loginDoctor(body);

          cookie.token!.path = '/';
          cookie.token!.httpOnly = true;
          cookie.token!.sameSite = 'lax';
          cookie.token!.value = token;

          return doctor;
        },
        {
          body: loginDoctorSchema,
          response: {
            200: doctorSchema,
            401: appErrorSchema,
            422: appErrorSchema,
            500: appErrorSchema,
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
            404: appErrorSchema,
            500: appErrorSchema,
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
          400: appErrorSchema,
          401: appErrorSchema,
          500: appErrorSchema,
        },
        beforeHandle: async ({ cookie, store }) => {
          const doctor = await authenticateDoctor(cookie.token.value);
          store.doctorId = doctor.id;
        },
      })
      .guard({
        // All routes below require admin authentication
        response: {
          403: appErrorSchema,
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
            409: appErrorSchema,
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
