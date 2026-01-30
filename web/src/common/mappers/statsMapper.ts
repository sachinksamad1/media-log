/**
 * Stats Mapper
 * Maps media types to activity verbs and groups for dashboard stats
 */

// Media type keys as returned by the backend API
export type MediaTypeKey =
  | 'anime'
  | 'manga'
  | 'movie'
  | 'game'
  | 'lightNovel'
  | 'tvSeries'
  | 'fiction'
  | 'nonFiction'

// Activity verb categories
export type ActivityVerb = 'watching' | 'reading' | 'playing'

// Mapping of media types to their activity verbs
export const MEDIA_TYPE_TO_VERB: Record<MediaTypeKey, ActivityVerb> = {
  anime: 'watching',
  movie: 'watching',
  tvSeries: 'watching',
  manga: 'reading',
  lightNovel: 'reading',
  fiction: 'reading',
  nonFiction: 'reading',
  game: 'playing',
}

// Grouped media types by activity verb
export const ACTIVITY_GROUPS: Record<ActivityVerb, MediaTypeKey[]> = {
  watching: ['anime', 'movie', 'tvSeries'],
  reading: ['manga', 'lightNovel', 'fiction', 'nonFiction'],
  playing: ['game'],
}

// Get activity verb for a media type
export function getActivityVerb(mediaType: string): ActivityVerb {
  return MEDIA_TYPE_TO_VERB[mediaType as MediaTypeKey] ?? 'watching'
}

// Get all media types for an activity verb
export function getMediaTypesForVerb(verb: ActivityVerb): MediaTypeKey[] {
  return ACTIVITY_GROUPS[verb]
}
