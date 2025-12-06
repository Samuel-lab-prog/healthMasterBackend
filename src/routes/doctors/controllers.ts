import { Elysia, t } from 'elysia';
import { appErrorSchema } from '../../utils/AppError.ts';
import { idSchema } from '../../utils/schemas.ts';
import { AuthPlugin } from '../../plugins/auth.ts';
import * as services from './services.ts';
import * as schemas from './schemas.ts';

export const doctorRouter = new Elysia({ prefix: '/doctors' })
  .get('/', async () => await services.getAllDoctors(), {
    response: {
      200: t.Array(schemas.doctorSchema),
      500: appErrorSchema,
    },
    detail: {
      summary: 'Get All Doctors',
      description: 'Retrieves a list of all Doctors.',
      tags: ['Doctor'],
    },
  })
  .use(AuthPlugin('admin'))
  .post(
    '/',
    async ({ body, set }) => {
      set.status = 201;
      return await services.registerDoctor(body);
    },
    {
      body: schemas.postDoctorSchema,
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
  );
