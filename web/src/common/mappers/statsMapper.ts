/**
 * Stats Mapper
 * Re-exports media type mappings and provides additional utility functions for dashboard stats
 */

// Re-export core mappings from media types
export {
  type MediaTypeKey,
  type ActivityVerb,
  MEDIA_TYPE_TO_ACTIVITY,
  ACTIVITY_TO_MEDIA_TYPES,
  getActivityForMediaType,
  getStatusLabelForMediaType,
} from '@common/types/media'

// Lowercase activity verb for display purposes
export type ActivityVerbLower = 'watching' | 'reading' | 'playing'

/**
 * Maps media types to their lowercase activity verbs (for display/grouping)
 */
export const MEDIA_TYPE_TO_VERB: Record<
  import('@common/types/media').MediaTypeKey,
  ActivityVerbLower
> = {
  anime: 'watching',
  movie: 'watching',
  tvSeries: 'watching',
  manga: 'reading',
  lightNovel: 'reading',
  fiction: 'reading',
  nonFiction: 'reading',
  game: 'playing',
}

/**
 * Groups media types by their lowercase activity verb
 */
export const ACTIVITY_GROUPS: Record<
  ActivityVerbLower,
  import('@common/types/media').MediaTypeKey[]
> = {
  watching: ['anime', 'movie', 'tvSeries'],
  reading: ['manga', 'lightNovel', 'fiction', 'nonFiction'],
  playing: ['game'],
}

/**
 * Get lowercase activity verb for a media type (for display)
 */
export function getActivityVerb(mediaType: string): ActivityVerbLower {
  return MEDIA_TYPE_TO_VERB[mediaType as import('@common/types/media').MediaTypeKey] ?? 'watching'
}

/**
 * Get all media types for a lowercase activity verb
 */
export function getMediaTypesForVerb(
  verb: ActivityVerbLower
): import('@common/types/media').MediaTypeKey[] {
  return ACTIVITY_GROUPS[verb]
}
