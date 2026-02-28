export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function getSkipTake(page = 1, limit = 10): { skip: number; take: number } {
  const take = Math.min(Math.max(1, limit), 100);
  const skip = (Math.max(1, page) - 1) * take;
  return { skip, take };
}
