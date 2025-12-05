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
  )
  .use(AuthPlugin('admin'))
  .patch(
    '/:id/restore',
    async ({ params }) => services.restoreConsultation(params.id),
    {
      params: t.Object({ id: idSchema }),
      response: {
        200: schemas.consultationSchema,
        404: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Restore Consultation',
        tags: ['Consultations'],
      },
    }
  )
  .patch(
    '/:id/status',
    async ({ params, body }) =>
      services.updateConsultationStatus(params.id, body.status),
    {
      params: t.Object({ id: idSchema }),
      body: t.Object({ status: schemas.consultationStatusSchema }),
      response: {
        200: schemas.consultationSchema,
        404: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Update Consultation Status',
        tags: ['Consultations'],
      },
    }
  )
  .patch(
    '/:id/notes',
    async ({ params, body }) =>
      services.updateConsultationNotes(params.id, body.notes),
    {
      params: t.Object({ id: idSchema }),
      body: t.Object({ notes: t.String() }),
      response: {
        200: schemas.consultationSchema,
        404: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Update Consultation Notes',
        tags: ['Consultations'],
      },
    }
  )
  .delete(
    '/:id',
    async ({ params }) => services.softDeleteConsultation(params.id),
    {
      params: t.Object({ id: idSchema }),
      response: {
        200: t.Object({ id: idSchema }),
        404: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Soft Delete Consultation',
        tags: ['Consultations'],
      },
    }
  )
  .get('/counts/status', async () => services.getConsultationCountsByStatus(), {
    response: {
      200: t.Object({
        scheduled: t.Number(),
        completed: t.Number(),
        cancelled: t.Number(),
        no_show: t.Number(),
      }),
      500: appErrorSchema,
    },
    detail: {
      summary: 'Get Consultation Counts by Status',
      tags: ['Consultations'],
    },
  });
