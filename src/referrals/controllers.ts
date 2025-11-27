import { Elysia, t } from 'elysia';
import { errorSchema } from '../utils/AppError.ts';
import {
  getReferralById,
  registerReferral,
  getAllReferrals,
  getReferralsByConsultationId,
  getUserReferralsByUserId,
  getDoctorReferralsByDoctorId,
} from './services';
import { postReferralSchema, referralSchema, referralIdSchema } from './schemas.ts';
import { authenticateDoctor } from '../doctors/services.ts';
import { tokenSchema, doctorIdSchema } from '../doctors/schemas.ts';
import { userIdSchema } from '../users/schemas.ts';
import { consultationIdSchema } from '../consultations/schemas.ts';

export const referralRouter = (app: Elysia) =>
  app.group('/Referrals', (app) =>
    app
      .state('doctorId', 0)
      .guard({
        // All routes below require doctor login authentication
        cookie: tokenSchema,
        beforeHandle: async ({ cookie, store }) => {
          store.doctorId = (await authenticateDoctor(cookie.token.value)).id;
        },
      })
      .post(
        '/',
        async ({ body, set }) => {
          console.log(body);
          const Referral = await registerReferral(body);
          set.status = 201;
          return Referral;
        },
        {
          body: postReferralSchema,
          response: {
            201: t.Object({ id: t.Number() }),
            400: errorSchema,
            409: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Register',
            description: 'Creates a new Referral. Returns an object with the new Referral ID.',
            tags: ['Referral'],
          },
        }
      )
      .get(
        '/',
        async () => {
          return await getAllReferrals();
        },
        {
          response: {
            200: t.Array(referralSchema),
            500: errorSchema,
          },
          detail: {
            summary: 'Get All Referrals',
            description: 'Retrieves all Referrals.',
            tags: ['Referral'],
          },
        }
      )
      .get(
        '/:id',
        async ({ params }) => {
          return await getReferralById(params.id);
        },
        {
          params: t.Object({ id: referralIdSchema }),
          response: {
            200: referralSchema,
            400: errorSchema,
            404: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Get Referral by ID',
            description: 'Retrieves a Referral by its ID.',
            tags: ['Referral'],
          },
        }
      )
      .get(
        '/consultation/:consultationId',
        async ({ params }) => {
          return await getReferralsByConsultationId(params.consultationId);
        },
        {
          params: t.Object({ consultationId: consultationIdSchema }),
          response: {
            200: t.Array(referralSchema),
            400: errorSchema,
            404: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Get Referrals by Consultation ID',
            description: 'Retrieves Referrals by the given consultation ID.',
            tags: ['Referral'],
          },
        }
      )
      .get(
        '/user/:userId',
        async ({ params }) => {
          return await getUserReferralsByUserId(Number(params.userId));
        },
        {
          params: t.Object({ userId: userIdSchema }),
          response: {
            200: t.Array(referralSchema),
            400: errorSchema,
            404: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Get Referrals by User ID',
            description: 'Retrieves Referrals by the given user ID.',
            tags: ['Referral'],
          },
        }
      )
      .get(
        '/doctor/:doctorId',
        async ({ params }) => {
          return await getDoctorReferralsByDoctorId(Number(params.doctorId));
        },
        {
          params: t.Object({ doctorId: doctorIdSchema }),
          response: {
            200: t.Array(referralSchema),
            400: errorSchema,
            404: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Get Referrals by Doctor ID',
            description: 'Retrieves Referrals by the given doctor ID.',
            tags: ['Referral'],
          },
        }
      )
  );
