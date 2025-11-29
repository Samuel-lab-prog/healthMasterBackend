/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from './connection.ts';
import { DatabaseError } from 'pg';
import {
  AppError,
  throwConflictError,
  throwBadRequestError,
  throwServerError,
  throwDatabaseError,
  throwNotFoundError,
} from '../utils/AppError.ts';

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function pluralize(str: string): string {
  return str.endsWith('s') ? str : str + 's';
}
function unpluralize(str: string): string {
  return str.endsWith('s') ? str.slice(0, -1) : str;
}

function extractEntity(query: string): string | undefined {
  const from = query.match(/\bFROM\s+([a-zA-Z0-9_]+)/i);
  const insert = query.match(/\bINTO\s+([a-zA-Z0-9_]+)/i);
  const update = query.match(/\bUPDATE\s+([a-zA-Z0-9_]+)/i);
  let raw = from?.[1] ?? insert?.[1] ?? update?.[1];
  if (raw) raw = unpluralize(raw);
  return raw ? toCamelCase(raw) : undefined;
}

function extractKey(query: string): string | undefined {
  const match = query.match(/\bWHERE\s+([a-zA-Z0-9_]+)\s*=/i);
  if (!match || !match[1]) return;
  return toCamelCase(match[1]);
}

export function createParams(size: unknown[]): string {
  return size.map((_, i) => `$${i + 1}`).join(', ');
}

type RunQueryOptions = {
  expectSingleRow?: boolean;
  throwIfNoRows?: boolean;
};

const defaultRunQueryOptions: RunQueryOptions = {
  expectSingleRow: false,
  throwIfNoRows: false,
};

export async function runQuery<Row, T>(
  query: string,
  params: any[],
  mapper: (row: Row) => T,
  options: { expectSingleRow: true; throwIfNoRows?: boolean }
): Promise<T>;

export async function runQuery<Row, T>(
  query: string,
  params: any[],
  mapper: (row: Row) => T,
  options?: { expectSingleRow: false; throwIfNoRows?: boolean }
): Promise<T[]>;

export async function runQuery<Row, T>(
  query: string,
  params: any[] = [],
  mapper: (row: Row) => T,
  options: RunQueryOptions = defaultRunQueryOptions
): Promise<T | T[]> {
  const { throwIfNoRows, expectSingleRow } = options;

  const keyName = extractKey(query) ?? 'key';
  const keyValue = params[0] ?? '';
  let entity = extractEntity(query) ?? 'entity';
  if (!expectSingleRow) {
    entity = pluralize(entity);
  }
    try {
      const { rows, command } = await pool.query(query, params);

      if (!expectSingleRow) {
        if (throwIfNoRows && rows.length === 0) {
          throwNotFoundError(`${entity} not found for ${keyName}=${keyValue}`);
        }
        return rows.map(mapper);
      }

      if (rows.length === 0) {
        if (command === 'INSERT') {
          throwDatabaseError(`No rows returned from INSERT query in ${entity}`);
        }
        if (command === 'SELECT') {
          throwNotFoundError(`${entity} not found for ${keyName}=${keyValue}`);
        }
        if (command === 'UPDATE' || command === 'DELETE') {
          throwDatabaseError(`No rows affected by ${command} query in ${entity}`);
        }
      }

      if (rows.length > 1) {
        throwDatabaseError(`Expected a single row but got ${rows.length}`);
      }
      return mapper(rows[0]);
    } catch (error) {
      if (error instanceof AppError) throw error;

      if (error instanceof DatabaseError) {
        const fieldFromDetail =
          error.detail?.match(/Key \(([^)=]+)\)/)?.[1] ?? error.detail?.match(/\(([^)=]+)\)=\(/)?.[1];

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
