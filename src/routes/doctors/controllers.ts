import { Elysia, t } from 'elysia';
import { appErrorSchema } from '../../utils/AppError.ts';
import { registerDoctor, getAllDoctors } from './services.ts';
import { postDoctorSchema, doctorSchema } from './schemas.ts';
import { idSchema } from '../../utils/schemas.ts';
import { AuthPlugin } from '../../plugins/index.ts';

export const doctorRouter = new Elysia()
  .group('/doctors', (app) =>
    app
      .use(AuthPlugin('admin'))
      .get(
        '/',
        async () => {
          return await getAllDoctors();
        },
        {
          response: {
            200: t.Array(doctorSchema),
            500: appErrorSchema,
          },
          detail: {
            summary: 'Get All Doctors',
            description: 'Retrieves a list of all Doctors.',
            tags: ['Doctor'],
          },
        }
      )
      .post(
        '/',
        async ({ body, set }) => {
          set.status = 201;
          return await registerDoctor(body);
        },
        {
          body: postDoctorSchema,
          response: {
            201: t.Object({ id: idSchema }),
            400: appErrorSchema,
            401: appErrorSchema,
            403: appErrorSchema,
            409: appErrorSchema,
            422: appErrorSchema,
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
