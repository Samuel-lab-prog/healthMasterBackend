/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from './connection.ts';
import { DatabaseError, type QueryResultRow } from 'pg';
import { AppError } from '../utils/AppError.ts';

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export async function runQuery<T extends QueryResultRow>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const { rows } = await pool.query<T>(query, params);
    return rows;
  } catch (error) {
    if (error instanceof AppError) throw error;

    if (error instanceof DatabaseError) {
      const fieldFromDetail =
        error.detail?.match(/Key \(([^)=]+)\)/)?.[1] ??
        error.detail?.match(/\(([^)=]+)\)=\(/)?.[1];
      const camelField = fieldFromDetail ? toCamelCase(fieldFromDetail) : undefined;

      if (error.code === '23505') {
        throw new AppError({
          statusCode: 409,
          errorMessages: [
            `Conflict: ${camelField ?? 'field'} already exists`
          ],
          originalError: error,
          origin: 'database'
        });
      }

      if (error.code === '23503') {
        throw new AppError({
          statusCode: 400,
          errorMessages: [
            `Invalid value for ${camelField ?? 'field'}: foreign key does not exist`
          ],
          originalError: error,
          origin: 'database'
        });
      }
      throw new AppError({
        statusCode: 500,
        errorMessages: ['A database error occurred'],
        originalError: error,
        origin: 'database'
      });
    }
    throw new AppError({
      statusCode: 500,
      errorMessages: ['An unexpected error occurred'],
      originalError: error as Error,
      origin: 'unknown'
    });
  }
}
