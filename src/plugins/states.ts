import { Elysia } from 'elysia';
import type { Doctor } from '../routes/doctors/types';
import type { User } from '../routes/users/types';

export const StatePlugin = (app: Elysia) =>
  app
    .state('isAuthenticated', false)
    .state('type', '' as 'user' | 'doctor' | '')
    .state('data', {} as Doctor | User)
    .state('isAdmin', false);

export type AppState = {
  isAuthenticated: boolean;
  type: 'user' | 'doctor' | '';
  data: Doctor | User;
  isAdmin: boolean;
};
