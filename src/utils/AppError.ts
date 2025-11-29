import { t } from "elysia";

export const appErrorSchema = t.Object({
  errorMessages: t.Array(t.String()),
  statusCode: t.Number(),
});

export type AppErrorType = {
  statusCode?: number;
  errorMessages?: string[];
  origin?: string;
  originalError?: Error;
};

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
  }: AppErrorType = {}) {
    super(errorMessages.join(', '));
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorMessages = errorMessages;
    this.origin = origin;
    this.originalError = originalError;
    Error.captureStackTrace?.(this, AppError);
  }
}

// Utility functions for common error scenarios
export function throwBadRequestError(message: string = 'Bad request'): never {
  throw new AppError({
    statusCode: 400,
    errorMessages: ['Bad Request: ' + message],
  });
}

export function throwUnauthorizedError(message: string = 'Unauthorized access'): never {
  throw new AppError({
    statusCode: 401,
    errorMessages: ['Unauthorized: ' + message],
  });
}
export function throwForbiddenError(message: string = 'Access is forbidden'): never {
  throw new AppError({
    statusCode: 403,
    errorMessages: ['Forbidden: ' + message],
  });
}

export function throwNotFoundError(message: string = 'The resource was not found'): never {
  throw new AppError({
    statusCode: 404,
    errorMessages: ['Not found: ' + message],
  });
}

export function throwConflictError(message: string = 'The resource already exists'): never {
  throw new AppError({
    statusCode: 409,
    errorMessages: ['Conflict: ' + message],
  });
}

export function throwGoneError(message: string = 'The resource has been deleted'): never {
  throw new AppError({
    statusCode: 410,
    errorMessages: ['Resource deleted: ' + message],
  });
}

export function throwUnprocessableEntityError(message: string = 'Unprocessable entity'): never {
  throw new AppError({
    statusCode: 422,
    errorMessages: ['Unprocessable Entity: ' + message],
  });
}
export function throwDatabaseError(message: string = 'A database error occurred'): never {
  throw new AppError({
    statusCode: 500,
    errorMessages: ['Database error: ' + message],
  });
}

export function throwServerError(): never {
  throw new AppError({
    statusCode: 500,
    errorMessages: ['Server error: An unexpected error occurred'],
  });
}
