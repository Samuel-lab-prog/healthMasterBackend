import { Elysia, t } from 'elysia';
import { errorSchema } from '../utils/AppError.ts';
import { getConsultationById, registerConsultation } from './services.ts';
import { postConsultationSchema, consultationSchema } from './schemas.ts';
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
            tags: ['Consultation'],
          },
        }
      )
      .get(
        '/:id',
        async ({ params }) => {
          return await getConsultationById(Number(params.id));
        },
        {
          params: t.Object({ id: t.Number() }),
          response: {
            200: consultationSchema,
            400: errorSchema,
            404: errorSchema,
            500: errorSchema,
          },
          detail: {
            summary: 'Get Consultation by ID',
            description: 'Retrieves a Consultation by its ID.',
            tags: ['Consultation'],
          },
        }
      )
  );
