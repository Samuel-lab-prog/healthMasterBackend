import { Elysia, t } from 'elysia';
import { errorSchema } from '../utils/AppError.ts';
import {
  getConsultationById,
  registerConsultation,
  getUserConsultationsById,
  getDoctorConsultationsById
} from './services.ts';
import {
  postConsultationSchema,
  consultationSchema,
  userConsultationSchema,
  doctorConsultationSchema,
  doctorIdSchema,
  consultationIdSchema,
  userIdSchema
} from './schemas.ts';
import { authenticateDoctor } from '../doctors/services.ts';
import { tokenSchema } from '../doctors/schemas.ts';

export const consultationRouter = (app: Elysia) =>
  app.group('/consultations', (app) =>
    app
      .state('doctorId', 0)
      .guard({
        // All routes below require doctor login authentication
        cookie: tokenSchema,
        beforeHandle: async ({ cookie, store }) => {
          store.doctorId = (await authenticateDoctor(cookie.token.value)).id;
        },
        response: { 401: errorSchema },
      })
      .post(
        '/',
        async ({ body, set }) => {
          console.log(body);
          const consultation = await registerConsultation(body);
          set.status = 201;
          return consultation;
        },
        {
          body: postConsultationSchema,
          response: {
            201: t.Object({ id: t.Number() }),
            400: errorSchema,
            409: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Register',
            description:
              'Creates a new Consultation. Returns an object with the new Consultation ID.',
            tags: ['Consultations'],
          },
        }
      )
      .get(
        '/:id',
        async ({ params }) => {
          return await getConsultationById(params.id);
        },
        {
          params: t.Object({ id: consultationIdSchema }),
          response: {
            200: consultationSchema,
            400: errorSchema,
            404: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Get Consultation by ID',
            description: 'Retrieves a Consultation by its ID.',
            tags: ['Consultations'],
          },
        }
      )
      .get('/users/:userId',
        async ({ params }) => {
          return await getUserConsultationsById(params.userId);
        },
        {
          params: t.Object({ userId: userIdSchema }),
          response: {
            200: t.Array(userConsultationSchema),
            400: errorSchema,
            404: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Get Consultations from User',
            description: 'Retrieves all Consultations for a given User ID.',
            tags: ['Consultations'],
          },
        }
      )
      .get('/doctors/:doctorId',
        async ({ params }) => {
          const result =  await getDoctorConsultationsById(params.doctorId);
          return result;
        },
        {
          params: t.Object({ doctorId: doctorIdSchema }),
          response: {
            200: t.Array(doctorConsultationSchema),
            400: errorSchema,
            404: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Get Consultations from Doctor',
            description: 'Retrieves all Consultations for a given Doctor ID.',
            tags: ['Consultations'],
          },
        }
      )
  );