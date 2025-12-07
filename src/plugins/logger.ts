import { Elysia } from 'elysia';
import * as l from '../utils/logger';

export const LoggerPlugin = () =>
  new Elysia({ name: 'LoggerPlugin' })
    .state('reqInitiatedAt', 0)
    .state('reqId', '')
    .onStart(() => {
      const HOST_NAME = 'localhost';
      const PORT = Number(process.env.PORT) || 3000;
      const PREFIX = '/api/v1';
      l.log.info(`🚀 Server started at http://${HOST_NAME}:${PORT}${PREFIX}`);
    })
    .onRequest((ctx) => {
      ctx.store.reqId = crypto.randomUUID();
      if (ctx.request.url.includes('/docs')) return;
      ctx.store.reqInitiatedAt = performance.now();
      l.logOnRequest(ctx.request, ctx.store.reqId);
    })
    .onAfterResponse((ctx) => {
      if (ctx.request.url.includes('/docs')) return;
      l.logOnAfterResponse(ctx, ctx.store.reqId, ctx.store.reqInitiatedAt, ctx.response);
    });
