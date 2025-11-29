import { Elysia, t } from 'elysia';
import { appErrorSchema } from '../../utils/AppError.ts';
import {
  getConsultationById,
  registerConsultation,
  getUserConsultationsByUserId,
  getDoctorConsultationsByDoctorId,
} from './services.ts';
import {
  postConsultationSchema,
  consultationSchema,
  userConsultationSchema,
  doctorConsultationSchema,
} from './schemas.ts';
import { idSchema, tokenSchema } from '../../utils/schemas.ts';
import { authenticateDoctor } from '../doctors/services.ts';

export const consultationRouter = (app: Elysia) =>
  app.group('/consultations', (app) =>
    app
      .state('doctorId', 0)
      .guard({
        // All routes below require doctor login authentication
        cookie: tokenSchema,
        beforeHandle: async ({ cookie, store }) => {
          const doctor = await authenticateDoctor(cookie.token.value);
          store.doctorId = doctor.id;
        },
        response: {
          400: appErrorSchema,
          401: appErrorSchema,
          403: appErrorSchema,
        },
      })
      .post(
        '/',
        async ({ body, set }) => {
          console.log('Registering consultation with body:', body);
          const consultation = await registerConsultation(body);
          set.status = 201;
          return consultation;
        },
        {
          body: postConsultationSchema,
          response: {
            201: t.Object({ id: idSchema }),
            409: appErrorSchema,
            500: appErrorSchema,
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
          params: t.Object({ id: idSchema }),
          response: {
            200: consultationSchema,
            404: appErrorSchema,
            500: appErrorSchema,
          },
          detail: {
            summary: 'Get Consultation by ID',
            description: 'Retrieves a Consultation by its ID.',
            tags: ['Consultations'],
          },
        }
      )
      .get(
        '/users/:userId',
        async ({ params }) => {
          return await getUserConsultationsByUserId(params.userId);
        },
        {
          params: t.Object({ userId: idSchema }),
          response: {
            200: t.Array(userConsultationSchema),
            404: appErrorSchema,
            500: appErrorSchema,
          },
          detail: {
            summary: 'Get Consultations from User',
            description: 'Retrieves all Consultations for a given User ID.',
            tags: ['Consultations'],
          },
        }
      )
      .get(
        '/doctors/:doctorId',
        async ({ params }) => {
          const result = await getDoctorConsultationsByDoctorId(params.doctorId);
          return result;
        },
        {
          params: t.Object({ doctorId: idSchema }),
          response: {
            200: t.Array(doctorConsultationSchema),
            404: appErrorSchema,
            500: appErrorSchema,
          },
          detail: {
            summary: 'Get Consultations from Doctor',
            description: 'Retrieves all Consultations for a given Doctor ID.',
            tags: ['Consultations'],
          },
        }
      )
  );
