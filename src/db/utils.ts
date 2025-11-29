/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from './connection.ts';
import { DatabaseError, } from 'pg';
import {
  AppError,
  throwConflictError,
  throwBadRequestError,
  throwServerError,
  throwDatabaseError,
} from '../utils/AppError.ts';

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
export async function runQuery<Row, T>(
  query: string,
  params: any[] = [],
  mapper: (row: Row) => T
): Promise<T[]> {
  try {
    const { rows } = await pool.query(query, params);

    if (rows.length === 0 )  {
      return [];  // Always return an empty list because no results is not an error
    }

    return rows.map(mapper);

  } catch (error) {
    if (error instanceof AppError) throw error;

    if (error instanceof DatabaseError) {
      const fieldFromDetail =
        error.detail?.match(/Key \(([^)=]+)\)/)?.[1] ??
        error.detail?.match(/\(([^)=]+)\)=\(/)?.[1];

      const camelField = fieldFromDetail ? toCamelCase(fieldFromDetail) : undefined;

      if (error.code === '23505') {
        throwConflictError(`${camelField ?? 'field'} already exists`);
      }

      if (error.code === '23503') {
        throwBadRequestError(`${camelField ?? 'field'} foreign key does not exist`);
      }

      if (error.code === '23502') {
        throwBadRequestError(`${camelField ?? 'field'} cannot be null`);
      }

      throwDatabaseError();
    }

    throwServerError(); 
  }
}


export function createParams(values: unknown[]): string {
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
  return placeholders;
}
