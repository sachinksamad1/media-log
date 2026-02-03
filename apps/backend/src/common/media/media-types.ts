/**
 * Re-export from shared package for backward compatibility.
 * New code should import directly from '@media-log/shared-types'
 */
export {
  // Status types
  type WatchStatus,
  type ReadStatus,
  type PlayStatus,
  type ActivityVerb,
  type CommonStatus,
  type MediaStatus,
  type AggregatedStatus,

  // Mappings
  STATUS_TO_AGGREGATED,
  AGGREGATED_TO_STATUSES,

  // Media type definitions
  type MediaTypeKey,
  MEDIA_TYPE_TO_ACTIVITY,
  ACTIVITY_TO_MEDIA_TYPES,

  // Stats types
  type MediaCategoryStats,
  type LibrarySummary,
  type ActivityStats,

  // Base media type
  type BaseMediaType,

  // Utility functions
  getActivityForMediaType,
  getAggregatedStatus,
  isOngoingStatus,
  getStatusesForAggregated,
  getMediaTypeLabel,
} from '@media-log/shared-types';
