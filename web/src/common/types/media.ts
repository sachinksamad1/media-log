/**
 * Media Types - Centralized type definitions for media status tracking
 *
 * Status System:
 * - Raw Status: User-facing status based on media type (Watching, Reading, Playing, etc.)
 * - Aggregated Status: Dashboard summary status (Ongoing, Planned, Completed)
 */

// =============================================================================
// RAW MEDIA STATUS TYPES
// =============================================================================

/**
 * Activity-based statuses for "ongoing" media consumption
 * These are the specific verbs used based on media type
 */
export type WatchStatus = 'Watching' // For anime, movies, TV series
export type ReadStatus = 'Reading' // For manga, novels, light novels, non-fiction
export type PlayStatus = 'Playing' // For games

/**
 * Activity verb type - the action associated with consuming media
 */
export type ActivityVerb = WatchStatus | ReadStatus | PlayStatus

/**
 * Common statuses shared across all media types
 */
export type CommonStatus = 'Planned' | 'Completed' | 'Dropped' | 'On-Hold'

/**
 * Full media status - all possible statuses a media item can have
 * This is the "raw" status stored in the database
 */
export type MediaStatus = ActivityVerb | CommonStatus

// =============================================================================
// AGGREGATED STATUS TYPES (for Dashboard)
// =============================================================================

/**
 * Aggregated status for dashboard statistics
 * Maps multiple raw statuses into simplified categories
 */
export type AggregatedStatus = 'ongoing' | 'planned' | 'completed' | 'dropped' | 'onHold'

/**
 * Maps raw MediaStatus to AggregatedStatus for dashboard summarization
 */
export const STATUS_TO_AGGREGATED: Record<MediaStatus, AggregatedStatus> = {
  // Activity verbs map to "ongoing"
  Watching: 'ongoing',
  Reading: 'ongoing',
  Playing: 'ongoing',
  // Common statuses map directly
  Planned: 'planned',
  Completed: 'completed',
  Dropped: 'dropped',
  'On-Hold': 'onHold',
}

/**
 * Reverse mapping: which raw statuses belong to each aggregated status
 */
export const AGGREGATED_TO_STATUSES: Record<AggregatedStatus, MediaStatus[]> = {
  ongoing: ['Watching', 'Reading', 'Playing'],
  planned: ['Planned'],
  completed: ['Completed'],
  dropped: ['Dropped'],
  onHold: ['On-Hold'],
}

// =============================================================================
// MEDIA TYPE DEFINITIONS
// =============================================================================

/**
 * All supported media type keys
 */
export type MediaTypeKey =
  | 'anime'
  | 'manga'
  | 'movie'
  | 'tvSeries'
  | 'fiction'
  | 'nonFiction'
  | 'lightNovel'
  | 'game'

/**
 * Maps media types to their appropriate activity verb
 */
export const MEDIA_TYPE_TO_ACTIVITY: Record<MediaTypeKey, ActivityVerb> = {
  anime: 'Watching',
  movie: 'Watching',
  tvSeries: 'Watching',
  manga: 'Reading',
  fiction: 'Reading',
  nonFiction: 'Reading',
  lightNovel: 'Reading',
  game: 'Playing',
}

/**
 * Groups media types by their activity verb
 */
export const ACTIVITY_TO_MEDIA_TYPES: Record<ActivityVerb, MediaTypeKey[]> = {
  Watching: ['anime', 'movie', 'tvSeries'],
  Reading: ['manga', 'fiction', 'nonFiction', 'lightNovel'],
  Playing: ['game'],
}

// =============================================================================
// DASHBOARD STATS TYPES
// =============================================================================

/**
 * Statistics for a single media category (matches backend response)
 */
export interface MediaCategoryStats {
  total: number
  completed: number
  ongoing: number
  planned: number
  dropped?: number
  onHold?: number
}

/**
 * Full library stats grouped by media type
 */
export type LibrarySummary = Record<MediaTypeKey, MediaCategoryStats>

/**
 * Dashboard activity stats - grouped by activity verb
 */
export interface ActivityStats {
  watching: number
  reading: number
  playing: number
}

// =============================================================================
// MEDIA ITEM TYPES
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

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get the appropriate activity verb for a media type
 */
export function getActivityForMediaType(mediaType: MediaTypeKey): ActivityVerb {
  return MEDIA_TYPE_TO_ACTIVITY[mediaType]
}

/**
 * Get the aggregated status from a raw media status
 */
export function getAggregatedStatus(status: MediaStatus): AggregatedStatus {
  return STATUS_TO_AGGREGATED[status]
}

/**
 * Check if a status is considered "ongoing" (active consumption)
 */
export function isOngoingStatus(status: MediaStatus): boolean {
  return STATUS_TO_AGGREGATED[status] === 'ongoing'
}

/**
 * Get all raw statuses that map to an aggregated status
 */
export function getStatusesForAggregated(aggregated: AggregatedStatus): MediaStatus[] {
  return AGGREGATED_TO_STATUSES[aggregated]
}

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
