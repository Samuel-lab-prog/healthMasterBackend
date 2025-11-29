import { throwNotFoundError } from './AppError';

export async function handleSingleResult<Full, Mapped>(
  promise: Promise<Full | null>,
  notFoundMessage: string,
  mapper: (data: Full) => Mapped
): Promise<Mapped> {
  const result = await promise;
  if (!result) throwNotFoundError(notFoundMessage);
  return mapper(result);
}

export async function handleListResult<Full, Mapped>(
  promise: Promise<Full[] | null>,
  notFoundMessage: string,
  mapper: (data: Full) => Mapped
): Promise<Mapped[]> {
  const list = await promise;
  if (!list || list.length === 0) throwNotFoundError(notFoundMessage);
  return list.map(mapper);
}
