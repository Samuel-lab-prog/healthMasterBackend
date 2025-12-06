import Elysia from 'elysia';
import cors from '@elysiajs/cors';
import { openapi, fromTypes } from '@elysiajs/openapi';
import { BunAdapter } from 'elysia/adapter/bun';
import { handleError } from './utils/handleError';
import { sanitize } from './utils/xssClean';

import { authRouter } from './routes/auth/controllers';
import { userRouter } from './routes/users/controllers';
import { doctorRouter } from './routes/doctors/controllers';
import { consultationRouter } from './routes/consultations/controllers';
import { referralRouter } from './routes/referrals/controllers';

const PREFIX = '/api/v1';
const INSTANCE_NAME = 'mainServerInstance';
const HOST_NAME = 'localhost';
const PORT = Number(process.env.PORT) || 3000;
const OPEN_API_SETTINGS = {
  path: '/docs',
  documentation: {
    info: {
      title: 'HealthMaster API',
      description: 'API documentation for HealthMaster API',
      version: '1.0.0',
    },
  },
  references: fromTypes()
};

export default new Elysia({
  adapter: BunAdapter,
  name: INSTANCE_NAME,
  prefix: PREFIX,
  sanitize: (value) => sanitize(value),
  serve: {
    hostname: HOST_NAME,
    port: PORT,
  },
})
  .onError(async ({ error, set, code }) => handleError(set, error, code))
  .use(cors())
  .get('/', () => 'HealthMaster API is running')
  .use(authRouter)
  .use(userRouter)
  .use(doctorRouter)
  .use(consultationRouter)
  .use(referralRouter)
  .use(openapi(OPEN_API_SETTINGS))
  .listen({ hostname: HOST_NAME, port: PORT });

console.log(`🚀 Server running at http://${HOST_NAME}:${PORT}${PREFIX}/docs`);
