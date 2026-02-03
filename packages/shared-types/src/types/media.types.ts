// =============================================================================
// MEDIA STATUS TYPES
// =============================================================================

/**
 * Activity-based statuses for "ongoing" media consumption
 */
export type WatchStatus = "Watching";
export type ReadStatus = "Reading";
export type PlayStatus = "Playing";

/**
 * Activity verb type - the action associated with consuming media
 */
export type ActivityVerb = WatchStatus | ReadStatus | PlayStatus;

/**
 * Common statuses shared across all media types
 */
export type CommonStatus = "Planned" | "Completed" | "Dropped" | "On-Hold";

/**
 * Full media status - all possible statuses a media item can have
 */
export type MediaStatus = ActivityVerb | CommonStatus;

// =============================================================================
// AGGREGATED STATUS TYPES (for Dashboard)
// =============================================================================

/**
 * Aggregated status for dashboard statistics
 */
export type AggregatedStatus =
  | "ongoing"
  | "planned"
  | "completed"
  | "dropped"
  | "onHold";

/**
 * Maps raw MediaStatus to AggregatedStatus for dashboard summarization
 */
export const STATUS_TO_AGGREGATED: Record<MediaStatus, AggregatedStatus> = {
  Watching: "ongoing",
  Reading: "ongoing",
  Playing: "ongoing",
  Planned: "planned",
  Completed: "completed",
  Dropped: "dropped",
  "On-Hold": "onHold",
};

/**
 * Reverse mapping: which raw statuses belong to each aggregated status
 */
export const AGGREGATED_TO_STATUSES: Record<AggregatedStatus, MediaStatus[]> = {
  ongoing: ["Watching", "Reading", "Playing"],
  planned: ["Planned"],
  completed: ["Completed"],
  dropped: ["Dropped"],
  onHold: ["On-Hold"],
};

// =============================================================================
// MEDIA TYPE DEFINITIONS
// =============================================================================

/**
 * All supported media type keys
 */
export type MediaTypeKey =
  | "anime"
  | "manga"
  | "movie"
  | "tvSeries"
  | "fiction"
  | "nonFiction"
  | "lightNovel"
  | "game";

/**
 * Maps media types to their appropriate activity verb
 */
export const MEDIA_TYPE_TO_ACTIVITY: Record<MediaTypeKey, ActivityVerb> = {
  anime: "Watching",
  movie: "Watching",
  tvSeries: "Watching",
  manga: "Reading",
  fiction: "Reading",
  nonFiction: "Reading",
  lightNovel: "Reading",
  game: "Playing",
};

/**
 * Groups media types by their activity verb
 */
export const ACTIVITY_TO_MEDIA_TYPES: Record<ActivityVerb, MediaTypeKey[]> = {
  Watching: ["anime", "movie", "tvSeries"],
  Reading: ["manga", "fiction", "nonFiction", "lightNovel"],
  Playing: ["game"],
};

// =============================================================================
// DASHBOARD STATS TYPES
// =============================================================================

/**
 * Statistics for a single media category
 */
export interface MediaCategoryStats {
  total: number;
  completed: number;
  ongoing: number;
  planned: number;
  dropped?: number;
  onHold?: number;
}

/**
 * Full library stats grouped by media type
 */
export type LibrarySummary = Record<MediaTypeKey, MediaCategoryStats>;

/**
 * Dashboard activity stats - grouped by activity verb
 */
export interface ActivityStats {
  watching: number;
  reading: number;
  playing: number;
}

// =============================================================================
// BASE MEDIA ENTITY INTERFACE
// =============================================================================

export interface BaseMediaType {
  id?: string;
  title: string;
  imageUrl?: string;
  userStats?: {
    status: MediaStatus;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get the appropriate activity verb for a media type
 */
export function getActivityForMediaType(mediaType: MediaTypeKey): ActivityVerb {
  return MEDIA_TYPE_TO_ACTIVITY[mediaType];
}

/**
 * Get the aggregated status from a raw media status
 */
export function getAggregatedStatus(status: MediaStatus): AggregatedStatus {
  return STATUS_TO_AGGREGATED[status];
}

/**
 * Check if a status is considered "ongoing" (active consumption)
 */
export function isOngoingStatus(status: MediaStatus): boolean {
  return STATUS_TO_AGGREGATED[status] === "ongoing";
}

/**
 * Get all raw statuses that map to an aggregated status
 */
export function getStatusesForAggregated(
  aggregated: AggregatedStatus,
): MediaStatus[] {
  return AGGREGATED_TO_STATUSES[aggregated];
}

/**
 * Get human-readable label for media type
 */
export function getMediaTypeLabel(mediaType: MediaTypeKey): string {
  const labels: Record<MediaTypeKey, string> = {
    anime: "Anime",
    manga: "Manga",
    movie: "Movie",
    tvSeries: "TV Series",
    fiction: "Fiction",
    nonFiction: "Non-Fiction",
    lightNovel: "Light Novel",
    game: "Game",
  };
  return labels[mediaType];
}
