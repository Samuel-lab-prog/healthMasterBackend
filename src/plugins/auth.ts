import { throwForbiddenError, throwUnauthorizedError } from '../utils/AppError.ts';
import { type AppState } from './states.ts';
import { Elysia } from 'elysia';

function authenticate(store: AppState, level?: 'doctor' | 'admin') {
  if (store.isAuthenticated !== true) {
    throwUnauthorizedError('Not authenticated');
  }

  switch (level) {
    case 'doctor':
      if (store.type !== 'doctor') {
        throwForbiddenError('Doctor access only');
      }
      break;

    case 'admin':
      if (store.isAdmin !== true) {
        throwForbiddenError('Admin access only');
      }
      break;
  }
}

export const AuthPlugin = (level?: 'doctor' | 'admin') => (app: Elysia) =>
  app.onBeforeHandle(({ store }) => authenticate(store as AppState, level));
