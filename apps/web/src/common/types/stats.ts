/**
 * Stats Types - API response types for library statistics
 */

import type { MediaCategoryStats, MediaTypeKey } from './media'

// Legacy alias for backward compatibility
export type MediaStats = MediaCategoryStats

/**
 * Stats API response structure
 */
export interface StatsResponse {
  success: boolean
  data: Record<string, MediaStats>
}

/**
 * Typed stats response with known media type keys
 */
export interface TypedStatsResponse {
  success: boolean
  data: Partial<Record<MediaTypeKey, MediaStats>>
}
