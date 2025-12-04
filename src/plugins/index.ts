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
      const token = cookie.token?.value;

      if (!token || typeof token !== 'string') {
        throwUnauthorizedError('Authentication required');
      }

      const entity = await authenticate(token);
      if (!entity) throwUnauthorizedError('Authentication required');

      store.clientData = entity;

      const role = entity.role;

      const hierarchy = {
        user: 1,
        doctor: 2,
        admin: 3,
      };

      if (hierarchy[role] < hierarchy[requestedLevel]) {
        throwForbiddenError(`${requestedLevel} level required`);
      }
    });
