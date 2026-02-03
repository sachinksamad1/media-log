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
} from '@media-log/shared-types'

// =============================================================================
// FRONTEND-SPECIFIC TYPES (not shared with backend)
// =============================================================================

export interface MediaItem {
  id: string
  title: string
  type: MediaTypeKey
  status: MediaStatus
  coverUrl: string
  progress?: number
  total?: number
  rating?: number
  year?: number
}

export interface MediaCategory {
  type: MediaTypeKey
  label: string
  icon: string
}

export const MEDIA_CATEGORIES: MediaCategory[] = [
  { type: 'anime', label: 'Anime', icon: 'Tv' },
  { type: 'manga', label: 'Manga', icon: 'BookOpen' },
  { type: 'fiction', label: 'Fiction', icon: 'Book' },
  { type: 'lightNovel', label: 'Light Novels', icon: 'BookText' },
  { type: 'nonFiction', label: 'Non-Fiction', icon: 'GraduationCap' },
  { type: 'movie', label: 'Movies', icon: 'Film' },
  { type: 'tvSeries', label: 'TV Series', icon: 'Tv2' },
  { type: 'game', label: 'Games', icon: 'Gamepad2' },
]

/**
 * Get the display label for a status based on media type
 * e.g., for anime "Ongoing" becomes "Watching"
 */
export function getStatusLabelForMediaType(status: MediaStatus, mediaType: MediaTypeKey): string {
  if (isOngoingStatus(status)) {
    return MEDIA_TYPE_TO_ACTIVITY[mediaType]
  }
  return status
}
