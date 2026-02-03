// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
}

/**
 * Pagination and metadata for API responses
 */
export interface ApiMeta {
  totalItems?: number;
  nextCursor?: string | null;
  count?: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

/**
 * Standard error response
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Paginated request params
 */
export interface PaginationParams {
  cursor?: string;
  limit?: number;
  page?: number;
  pageSize?: number;
}

/**
 * Sort options for queries
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Filter params for media queries
 */
export interface MediaFilterParams extends PaginationParams, SortParams {
  status?: string;
  genre?: string;
  search?: string;
}
