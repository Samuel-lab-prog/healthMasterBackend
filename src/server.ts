import Elysia from 'elysia';
import { openapi } from '@elysiajs/openapi';
import cors from '@elysiajs/cors';
import { handleError } from './middlewares/handleError';
import { xssClean } from './middlewares/xssClean';
import { userRouter } from './users/controllers';
import { doctorRouter } from './doctors/controllers';

new Elysia()
.onError(async ({error, set}) => handleError(set, error))
.use(cors())
.onBeforeHandle((ctx) => xssClean(ctx) )
  .use(userRouter)
  .use(doctorRouter)
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
  .listen({
    port: Number(process.env.PORT) || 3000,
    hostname: '0.0.0.0',
  });

console.log('Server running at http://localhost:' + (process.env.PORT || 3000));
