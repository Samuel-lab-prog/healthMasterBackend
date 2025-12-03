import { Elysia, t } from 'elysia';
import { appErrorSchema } from '../../utils/AppError.ts';
import * as services from './services';
import * as schemas from './schemas.ts';
import { idSchema } from '../../utils/schemas.ts';
import { AuthPlugin } from '../../plugins/index.ts';

export const referralRouter = (app: Elysia) =>
  app.group('/referrals', (app) =>
    app
      .use(AuthPlugin())
      .get(
        '/user/:userId',
        async ({ params }) => {
          return await services.getUserReferralsByUserId(params.userId);
        },
        {
          params: t.Object({ userId: idSchema }),
          response: {
            200: t.Array(schemas.userReferralSchema),
            400: appErrorSchema,
            404: appErrorSchema,
            500: appErrorSchema,
          },
          detail: {
            summary: 'Get Referrals by User ID',
            description: 'Retrieves Referrals by the given user ID.',
            tags: ['Referrals'],
          },
        }
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
            400: appErrorSchema,
            409: appErrorSchema,
            500: appErrorSchema,
          },
          detail: {
            summary: 'Register',
            description: 'Creates a new Referral. Returns an object with the new Referral ID.',
            tags: ['Referrals'],
          },
        }
      )
      .get(
        '/',
        async () => {
          return await services.getAllReferrals();
        },
        {
          response: {
            200: t.Array(schemas.referralSchema),
            500: appErrorSchema,
          },
          detail: {
            summary: 'Get All Referrals',
            description: 'Retrieves all Referrals.',
            tags: ['Referrals'],
          },
        }
      )
      .get(
        '/:id',
        async ({ params }) => {
          return await services.getReferralById(params.id);
        },
        {
          params: t.Object({ id: idSchema }),
          response: {
            200: schemas.referralSchema,
            400: appErrorSchema,
            404: appErrorSchema,
            500: appErrorSchema,
          },
          detail: {
            summary: 'Get Referral by ID',
            description: 'Retrieves a Referral by its ID.',
            tags: ['Referrals'],
          },
        }
      )
      .get(
        '/consultation/:consultationId',
        async ({ params }) => {
          return await services.getReferralsByConsultationId(params.consultationId);
        },
        {
          params: t.Object({ consultationId: idSchema }),
          response: {
            200: t.Array(schemas.referralSchema),
            400: appErrorSchema,
            404: appErrorSchema,
            500: appErrorSchema,
          },
          detail: {
            summary: 'Get Referrals by Consultation ID',
            description: 'Retrieves Referrals by the given consultation ID.',
            tags: ['Referrals'],
          },
        }
      )
      .get(
        '/doctor/:doctorId',
        async ({ params }) => {
          return await services.getDoctorReferralsByDoctorId(params.doctorId);
        },
        {
          params: t.Object({ doctorId: idSchema }),
          response: {
            200: t.Array(schemas.doctorReferralSchema),
            400: appErrorSchema,
            404: appErrorSchema,
            500: appErrorSchema,
          },
          detail: {
            summary: 'Get Referrals by Doctor ID',
            description: 'Retrieves Referrals by the given doctor ID.',
            tags: ['Referrals'],
          },
        }
      )
  );
