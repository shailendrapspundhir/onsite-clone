/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Pagination input
 */
export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

/**
 * ID input (for single-entity operations)
 */
export interface IdInput {
  id: string;
}

/**
 * Generic API error payload
 */
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

/**
 * Health check response
 */
export interface HealthCheck {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  timestamp: string;
  version?: string;
  database?: boolean;
  redis?: boolean;
}
