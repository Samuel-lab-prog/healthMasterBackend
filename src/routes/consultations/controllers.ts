import { Elysia, t } from 'elysia';
import { appErrorSchema, throwForbiddenError } from '../../utils/AppError.ts';
import { idSchema } from '../../utils/schemas.ts';
import { AuthPlugin } from '../../plugins/auth.ts';

import * as services from './services.ts';
import * as schemas from './schemas.ts';
import * as types from './types.ts';

export const consultationRouter = new Elysia()
  .use(AuthPlugin('user'))
  .get(
    '/users/:userId/consultations',
    async ({ params, store }) => {
      const client = store.clientData!;
      // May become a helper function later
      if (params.userId !== client.id) {
        throwForbiddenError('You can only access your own consultations');
      }
      const rows = await services.getUserConsultations(params.userId);
      return rows.map((row) => types.toUserConsultationView(row));
    },
    {
      params: t.Object({ userId: idSchema }),
      response: {
        200: t.Array(schemas.userConsultationSchema),
        404: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Get all consultations from a user',
        tags: ['Consultations'],
      },
    }
  )
  .get(
    '/users/:userId/consultations/:consultationId',
    async ({ params, store }) => {
      const client = store.clientData!;
      const row = await services.getConsultationById(params.consultationId);
      // May become a helper function later
      if (row.userId !== client.id) {
        throwForbiddenError('You can only access your own consultations');
      }
      return types.toUserConsultationView(row);
    },
    {
      params: t.Object({ userId: idSchema, consultationId: idSchema }),
      response: {
        200: schemas.userConsultationSchema,
        404: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Get a consultation by ID ',
        tags: ['Consultations'],
      },
    }
  )
  .use(AuthPlugin('doctor'))
  .post(
    '/consultations',
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
        summary: 'Register a consultation. Requires doctor level auth',
        tags: ['Consultations'],
      },
    }
  )
  .get(
    '/doctors/:doctorId/consultations',
    async ({ params }) => {
      const rows = await services.getDoctorConsultations(params.doctorId);
      return rows.map(types.toDoctorConsultationView);
    },
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
  .patch(
    '/consultations/:id/status',
    async ({ params, body }) => {
      const result = await services.patchConsultationStatusById(
        params.id,
        body.status
      );
      return types.toDoctorConsultationView(result);
    },
    {
      params: t.Object({ id: idSchema }),
      body: t.Object({ status: schemas.doctorConsultationSchema['status'] }),
      response: {
        200: schemas.doctorConsultationSchema,
        404: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Update Consultation Status by ID',
        tags: ['Consultations'],
      },
    }
  )
  .patch(
    '/consultations/:id/notes',
    async ({ params, body }) => {
      const result = await services.patchConsultationNotesById(params.id, body.notes);
      return types.toDoctorConsultationView(result);
    },
    {
      params: t.Object({ id: idSchema }),
      body: t.Object({ notes: t.String() }),
      response: {
        200: schemas.doctorConsultationSchema,
        404: appErrorSchema,
        500: appErrorSchema,
      },
      detail: {
        summary: 'Update Consultation Notes by ID',
        tags: ['Consultations'],
      },
    }
  )
  .get('/consultations', async () => {
    const rows = await services.getAllConsultations();
    return rows.map(types.toDoctorConsultationView);
  }, {
    response: {
      200: t.Array(schemas.doctorConsultationSchema),
      500: appErrorSchema,
    },
    detail: {
      summary: 'Get All Consultations',
      tags: ['Consultations'],
    },
  })
  .get('/consultations/deleted', async () => {
    const rows = await services.getAllDeletedConsultations();
    return rows.map(types.toDoctorConsultationView);
  }, {
    response: {
      200: t.Array(schemas.doctorConsultationSchema),
      500: appErrorSchema,
    },
    detail: {
      summary: 'Get All Deleted Consultations',
      tags: ['Consultations'],
    },
  });
