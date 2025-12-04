import { Elysia } from 'elysia';
import { authenticate } from '../routes/auth/services.ts';
import { throwUnauthorizedError, throwForbiddenError } from '../utils/AppError.ts';
import type { Doctor } from '../routes/doctors/types.ts';
import type { User } from '../routes/users/types.ts';

export type AuthLevels = 'user' | 'doctor' | 'admin';

export const AuthPlugin = (requestedLevel: AuthLevels = 'user') =>
  new Elysia()
    .state('clientData', <null | Doctor | User>null)
    .onBeforeHandle({ as: 'scoped' }, async ({ cookie, store }) => {
      if (!cookie.token || typeof cookie.token.value !== 'string') {
        throwUnauthorizedError('Authentication required');
      }

      const entity = await authenticate(cookie.token.value);
      if (!entity) {
        throwUnauthorizedError('Authentication required');
      }

      store.clientData = entity;

      const role = entity.role;

      if (requestedLevel === 'user') return;

      if (requestedLevel === 'doctor') {
        if (role === 'doctor' || role === 'admin') return;
        throwForbiddenError('Doctor level required');
      }

      if (requestedLevel === 'admin') {
        if (role === 'admin') return;
        throwForbiddenError('Admin level required');
      }
    });
