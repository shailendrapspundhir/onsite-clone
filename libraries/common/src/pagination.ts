import type { PaginatedResult, PaginationInput } from '@onsite360/types';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@onsite360/types';

export function normalizePagination(input?: PaginationInput): { page: number; pageSize: number; offset: number; limit: number } {
  const page = Math.max(1, input?.page ?? 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, input?.pageSize ?? DEFAULT_PAGE_SIZE));
  const offset = (page - 1) * pageSize;
  return { page, pageSize, offset, limit: pageSize };
}

export function buildPaginatedResult<T>(items: T[], total: number, page: number, pageSize: number): PaginatedResult<T> {
  const totalPages = Math.ceil(total / pageSize) || 1;
  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}
