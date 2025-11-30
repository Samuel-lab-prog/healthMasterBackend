/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from '../../utils/AppError.ts';

export function handleError(set: any, error: unknown) {
  if (error instanceof AppError) {
    const statusCode = error.statusCode;
    set.status = statusCode;

    console.error('---------------------AppError---------------------');
    console.error(`Status: ${statusCode}`);
    console.error(`Messages: ${error.errorMessages.join(', ')}`);
    console.error(`Stack: ${error.stack ?? 'No stack trace available'}`);
    console.error('--------------------------------------------------');

    return {
      errorMessages: error.errorMessages,
      statusCode,
    };
  }

  const statusCode = typeof set.status === 'number' && set.status >= 400 ? set.status : 500;

  set.status = statusCode;

  console.error('------------------Unexpected Error------------------');
  console.error(`Status: ${statusCode}`);
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  console.error(`Stack: ${error instanceof Error ? error.stack : 'No stack trace available'}`);
  console.error('----------------------------------------------------');

  return {
    errorMessages: ['An unexpected error occurred'],
    statusCode,
  };
}
