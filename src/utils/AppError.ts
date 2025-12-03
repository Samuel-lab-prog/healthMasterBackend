/* eslint-disable @typescript-eslint/no-explicit-any */
import { t } from 'elysia';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export function handlePrismaError<T>(error: PrismaClientKnownRequestError, data?: T): never {
  const table = (error.meta as any)?.modelName || 'unknown';

  switch (error.code) {
    case 'P2002':
      {
        let fields: string[] = [];
        const originalMsg = (error.meta as any)?.driverAdapterError?.cause?.originalMessage as
          | string
          | undefined;

        if (originalMsg) {
          const matches = [...originalMsg.matchAll(/"(?:[a-zA-Z0-9]+_)?([a-zA-Z0-9_]+)_key"/g)];
          if (matches.length > 0) {
            fields = matches.map((m) => m[1]).filter((s): s is string => typeof s === 'string');
          }
        }

        if (fields.length === 0) fields = ['field'];

        const isRecord = data !== undefined && data !== null && typeof data === 'object';
        const d = data as Record<string, unknown> | undefined;
        const messages = fields.map((f) =>
          isRecord && f in (d as Record<string, unknown>) ? `${f} = ${String(d![f])}` : f
        );
        const finalMessage = `unique ${messages.join(', ')} already exists in ${table}`;

        throwConflictError(finalMessage);
      }
      break;
    case 'P2003':
      {
        const fkField = (error.meta as any)?.field_name || 'foreign key';
        throwConflictError(`foreign key constraint failed on ${fkField} in ${table}`);
      }
      break;
    default:
      throw error;
  }
}

export async function withPrismaErrorHandling<T>(callback: () => Promise<T>): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      handlePrismaError<T>(error);
    }
    throwDatabaseError((error as Error).message);
  }
}

export const appErrorSchema = t.Object({
  errorMessages: t.Array(t.String()),
  statusCode: t.Number({
    minimum: 400,
    maximum: 599,
    errorMessage: 'Error status code must be between 400 and 599',
  }),
});

export function makeValidationError(message: string) {
  return {
    error() {
      throwUnprocessableEntityError(message);
    },
  };
}

export function makeBadRequestError(message: string) {
  return {
    error() {
      throwBadRequestError(message);
    },
  };
}

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
