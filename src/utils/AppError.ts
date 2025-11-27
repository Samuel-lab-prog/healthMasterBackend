import { t } from 'elysia';

export type errorsType = {
  statusCode?: number;
  errorMessages?: string[];
  origin?: string;
  originalError?: Error;
};

export const errorSchema = t.Object({
  errorMessages: t.Array(t.String()),
  statusCode: t.Number(),
});

export class AppError extends Error {
  public statusCode: number;
  public errorMessages: string[];
  public origin?: string;
  public originalError?: Error;

  constructor({
    statusCode = 500,
    errorMessages = ['Application Error'],
    origin,
    originalError,
  }: errorsType = {}) {
    super(errorMessages.join(', '));
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorMessages = errorMessages;
    this.origin = origin;
    this.originalError = originalError;
    Error.captureStackTrace?.(this, AppError);
  }
}
