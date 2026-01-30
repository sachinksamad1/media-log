/**
 * Dashboard Types
 * Re-exports and extends media types for dashboard-specific use cases
 */

import type { MediaCategoryStats } from '@common/media/media-types.js';

// Re-export core types from media-types
export {
  type MediaStatus,
  type AggregatedStatus,
  type MediaTypeKey,
  type MediaCategoryStats,
  type LibrarySummary,
  type ActivityStats,
  type ActivityVerb,
  STATUS_TO_AGGREGATED,
  AGGREGATED_TO_STATUSES,
  MEDIA_TYPE_TO_ACTIVITY,
  ACTIVITY_TO_MEDIA_TYPES,
  getActivityForMediaType,
  getAggregatedStatus,
  isOngoingStatus,
  getStatusesForAggregated,
} from '@common/media/media-types.js';

// Legacy type alias for backward compatibility
export type LibraryStats = MediaCategoryStats;
