import { Elysia, t } from 'elysia';
import { appErrorSchema, throwForbiddenError } from '../../utils/AppError.ts';
import { idSchema } from '../../utils/schemas.ts';
import { AuthPlugin } from '../../plugins/index.ts';
import * as services from './services.ts';
import * as schemas from './schemas.ts';

export const consultationRouter = new Elysia({
  prefix: '/consultations',
})
  .use(AuthPlugin('user'))
  .get(
    '/users/:userId',
    async ({ params, store }) => {
      const targetId = params.userId;
      if (store.clientData!.role !== 'admin' && store.clientData!.id !== targetId) {
        throwForbiddenError('You cannot access this user’s consultations.');
      }

      return await services.getUserConsultations(targetId);
    },
    {
      params: t.Object({ userId: idSchema }),
      response: {
        200: t.Array(schemas.userConsultationSchema),
        404: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Get Consultations from User',
        tags: ['Consultations'],
      },
    }
  )
  .use(AuthPlugin('doctor'))
  .post(
    '/',
    async ({ body, set }) => {
      set.status = 201;
      return services.registerConsultation(body);
    },
    {
      body: schemas.postConsultationSchema,
      response: {
        201: t.Object({ id: idSchema }),
        409: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Register Consultation',
        tags: ['Consultations'],
      },
    }
  )
  .get('/:id', async ({ params }) => services.getConsultationById(params.id), {
    params: t.Object({ id: idSchema }),
    response: {
      200: schemas.consultationSchema,
      404: appErrorSchema,
      500: appErrorSchema,
    },
    detail: {
      summary: 'Get Consultation by ID',
      tags: ['Consultations'],
    },
  })
  .get(
    '/doctors/:doctorId',
    async ({ params }) => services.getDoctorConsultations(params.doctorId),
    {
      params: t.Object({ doctorId: idSchema }),
      response: {
        200: t.Array(schemas.doctorConsultationSchema),
        404: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Get Consultations from Doctor',
        tags: ['Consultations'],
      },
    }
  );
