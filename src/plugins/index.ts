import type { User } from '../routes/users/types.ts';
import type { Doctor } from '../routes/doctors/types.ts';
import { throwForbiddenError, throwUnauthorizedError } from '../utils/AppError.ts';
import { Elysia } from 'elysia';

export type AuthLevels = 'user' | 'doctor' | 'admin' | null;


export const SetupPlugin = new Elysia()
  .state('authLevel', null as AuthLevels)
  .state('clientData', null as User | Doctor | null);

export const AuthPlugin = (requestedLevel: AuthLevels = 'user') => new Elysia()
  .use(SetupPlugin)
  .onBeforeHandle({ as: 'scoped' }, ({ store }) => {
    console.log('AuthPlugin: Checking authentication for level:', requestedLevel);
    console.log('Current authLevel:', store.authLevel);
    const authLevel = store.authLevel;

    switch (requestedLevel) {
      case 'user':
        if (authLevel === null) {
          throwUnauthorizedError('Authentication required');
        }
        break;
      case 'doctor':
        if (authLevel !== 'doctor' && authLevel !== 'admin') {
          throwForbiddenError('Doctor access only');
        }
        break;
      case 'admin':
        if (authLevel !== 'admin') {
          throwForbiddenError('Admin access only');
        }
        break;
    }
  })
