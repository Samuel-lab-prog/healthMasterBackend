import { Elysia, t } from 'elysia';
import { appErrorSchema, throwForbiddenError } from '../../utils/AppError.ts';
import { idSchema } from '../../utils/schemas.ts';
import { AuthPlugin } from '../../plugins/index.ts';
import * as services from './services';
import * as schemas from './schemas.ts';

const errorResponses = {
  400: appErrorSchema,
  404: appErrorSchema,
  500: appErrorSchema,
};

export const referralRouter = new Elysia({ prefix: '/referrals' })
  .use(AuthPlugin('user'))
  .group('/user', (app) =>
    app.get(
      '/:userId',
      async ({ params, store }) => {
        const targetId = params.userId;

        if (store.clientData!.role !== 'admin' && store.clientData!.id !== targetId) {
          throwForbiddenError('You cannot access this user’s referrals.');
        }

        return await services.getUserReferrals(targetId);
      },
      {
        params: t.Object({ userId: idSchema }),
        response: {
          200: t.Array(schemas.userReferralSchema),
          ...errorResponses,
        },
        detail: {
          summary: 'Get Referrals by User ID',
          tags: ['Referrals'],
        },
      }
    )
  )
  .use(AuthPlugin('doctor'))
  .post(
    '/',
    async ({ body, set }) => {
      set.status = 201;
      return await services.registerReferral(body);
    },
    {
      body: schemas.postReferralSchema,
      response: {
        201: t.Object({ id: idSchema }),
        ...errorResponses,
      },
      detail: {
        summary: 'Register Referral',
        tags: ['Referrals'],
      },
    }
  )
  .get('/', async () => await services.getAllReferrals(), {
    response: {
      200: t.Array(schemas.referralSchema),
      500: appErrorSchema,
    },
    detail: {
      summary: 'Get All Referrals',
      tags: ['Referrals'],
    },
  })
  .get('/:id', async ({ params }) => await services.getReferralById(params.id), {
    params: t.Object({ id: idSchema }),
    response: {
      200: schemas.referralSchema,
      ...errorResponses,
    },
    detail: {
      summary: 'Get Referral by ID',
      tags: ['Referrals'],
    },
  })
  .get(
    '/consultation/:consultationId',
    async ({ params }) => await services.getReferralsByConsultationId(params.consultationId),
    {
      params: t.Object({ consultationId: idSchema }),
      response: {
        200: t.Array(schemas.referralSchema),
        ...errorResponses,
      },
      detail: {
        summary: 'Get Referrals by Consultation ID',
        tags: ['Referrals'],
      },
    }
  )
  .get(
    '/doctor/:doctorId',
    async ({ params }) => await services.getDoctorReferrals(params.doctorId),
    {
      params: t.Object({ doctorId: idSchema }),
      response: {
        200: t.Array(schemas.doctorReferralSchema),
        ...errorResponses,
      },
      detail: {
        summary: 'Get Referrals by Doctor ID',
        tags: ['Referrals'],
      },
    }
  )
  .patch(
    '/:id/status',
    async ({ params, body }) => await services.updateReferralStatus(params.id, body.status),
    {
      params: t.Object({ id: idSchema }),
      body: t.Object({ status: schemas.postReferralSchema.properties.status }),
      response: {
        200: schemas.referralSchema,
        ...errorResponses,
      },
      detail: {
        summary: 'Update Referral Status',
        tags: ['Referrals'],
      },
    }
  )
  .delete('/:id', async ({ params }) => await services.deleteReferral(params.id), {
    params: t.Object({ id: idSchema }),
    response: {
      200: t.Object({ id: idSchema }),
      ...errorResponses,
    },
    detail: {
      summary: 'Delete Referral',
      tags: ['Referrals'],
    },
  })
  .delete(
    '/consultation/:consultationId',
    async ({ params }) => await services.softDeleteReferralsByConsultationId(params.consultationId),
    {
      params: t.Object({ consultationId: idSchema }),
      response: {
        200: t.Array(t.Object({ id: idSchema })),
        ...errorResponses,
      },
      detail: {
        summary: 'Soft Delete Referrals by Consultation ID',
        tags: ['Referrals'],
      },
    }
  )
  .patch(
    '/:id/restore',
    async ({ params }) => await services.restoreReferral(params.id),
    {
      params: t.Object({ id: idSchema }),
      response: {
        200: schemas.referralSchema,
        ...errorResponses,
      },
      detail: {
        summary: 'Restore Referral',
        tags: ['Referrals'],
      },
    }
  )
  .patch(
    '/:id/notes',
    async ({ params, body }) => await services.updateReferralNotes(params.id, body.notes),
    {
      params: t.Object({ id: idSchema }),
      body: t.Object({ notes: t.String() }),
      response: {
        200: schemas.referralSchema,
        ...errorResponses,
      },
      detail: {
        summary: 'Update Referral Notes',
        tags: ['Referrals'],
      },
    }
  )
  .patch(
    '/:id/status',
    async ({ params, body }) => await services.updateReferralStatus(params.id, body.status),
    {
      params: t.Object({ id: idSchema }),
      body: t.Object({ status: schemas.postReferralSchema.properties.status }),
      response: {
        200: schemas.referralSchema,
        ...errorResponses,
      },
      detail: {
        summary: 'Change Referral Status',
        tags: ['Referrals'],
      },
    }
  )