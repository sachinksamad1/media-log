/**
 * Dashboard Types
 * Re-exports media types for dashboard-specific use cases
 */

// Re-export from centralized media types
export type {
  MediaCategoryStats,
  LibrarySummary,
  ActivityStats,
  MediaTypeKey,
  MediaStatus,
  AggregatedStatus,
  ActivityVerb,
} from '@common/types/media'

// Legacy type aliases for backward compatibility
export type { MediaCategoryStats as MediaSummary } from '@common/types/media'

/**
 * Dashboard stats structure (legacy format)
 */
export interface DashboardStats {
  anime: import('@common/types/media').MediaCategoryStats
  manga: import('@common/types/media').MediaCategoryStats
  games: import('@common/types/media').MediaCategoryStats
  movies?: import('@common/types/media').MediaCategoryStats
  tvSeries?: import('@common/types/media').MediaCategoryStats
  fiction?: import('@common/types/media').MediaCategoryStats
  nonFiction?: import('@common/types/media').MediaCategoryStats
  lightNovel?: import('@common/types/media').MediaCategoryStats
}
