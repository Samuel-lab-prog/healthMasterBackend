import Elysia from 'elysia';
import cors from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
import { handleError } from './utils/middlewares/handleError';
import { sanitize } from './utils/middlewares/xssClean';
import { userRouter } from './routes/users/controllers';
import { doctorRouter } from './routes/doctors/controllers';
import { consultationRouter } from './routes/consultations/controllers';
import { referralRouter } from './routes/referrals/controllers';
import { authRouter } from './routes/auth/controllers';
import { StatePlugin } from './plugins/states';
import { BunAdapter } from 'elysia/adapter/bun';

const PREFIX = '/api/v1';
const INSTANCE_NAME = 'mainServerInstance';
const HOST_NAME = '0.0.0.0';
const PORT = Number(process.env.PORT) || 3000;

new Elysia({
  adapter: BunAdapter,
  name: INSTANCE_NAME,
  prefix: PREFIX,
  sanitize: (value) => sanitize(value),
  serve: {
    hostname: HOST_NAME,
    port: PORT,
  },
})
  .onError(async ({ error, set }) => handleError(set, error))
  .use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],  
    credentials: true,
  }))
  .use(StatePlugin)
  .use(authRouter)
  .use(userRouter)
  .use(doctorRouter)
  .use(referralRouter)
  .use(consultationRouter)
  .use(
    openapi({
      path: '/docs',
      documentation: {
        info: {
          title: 'HealthMaster API',
          description: 'API documentation for HealthMaster API',
          version: '1.0.0',
        },
      },
    })
  )
  .listen({ hostname: HOST_NAME, port: PORT });

console.log('Server running at http://' + HOST_NAME + ':' + PORT + PREFIX + '/docs');
