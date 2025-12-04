/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from '../utils/AppError.ts';

export function handleError(set: any, error: unknown, code: any) {
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

  const converted = convertElysiaError(code);

  if (converted instanceof AppError) {
    const statusCode = converted.statusCode;
    set.status = statusCode;

    console.error('------------------Converted Error------------------');
    console.error(`Status: ${statusCode}`);
    console.error(`Messages: ${converted.errorMessages.join(', ')}`);
    console.error(`Stack: ${converted.stack ?? 'No stack trace available'}`);
    console.error('----------------------------------------------------');

    return {
      errorMessages: converted.errorMessages,
      statusCode,
    };
  }

  const statusCode =
    typeof set.status === 'number' && set.status >= 400 ? set.status : 500;

  set.status = statusCode;

  console.error('------------------Unexpected Error------------------');
  console.error(`Status: ${statusCode}`);
  console.error(
    `Error: ${error instanceof Error ? error.message : String(error)}`
  );
  console.error(
    `Stack: ${error instanceof Error ? error.stack : 'No stack trace available'}`
  );
  console.error('----------------------------------------------------');

  return {
    errorMessages: ['An unexpected error occurred'],
    statusCode,
  };
}

function convertElysiaError(code: string): AppError {
  switch (code) {
    case 'NOT_FOUND':
      return new AppError({ statusCode: 404, errorMessages: ['Not Found: resource not found'] });
    case 'PARSE':
      return new AppError({ statusCode: 400, errorMessages: ['Bad request: failed to parse request body'] });
    case 'VALIDATION':
      return new AppError({ statusCode: 422, errorMessages: ['Unprocessable entity: validation failed'] });
    case 'INVALID_COOKIE_SIGNATURE':
      return new AppError({ statusCode: 401, errorMessages: ['Unauthorized: invalid cookie signature'] });
    case 'INVALID_FILE_TYPE':
      return new AppError({ statusCode: 400, errorMessages: ['Bad request: invalid file type'] });
    case 'INTERNAL_SERVER_ERROR':
    case 'UNKNOWN':
      return new AppError({ statusCode: 500, errorMessages: ['Internal server error'] });
    default:
      return new AppError({ statusCode: 500, errorMessages: ['Internal server error'] });
  }
}
