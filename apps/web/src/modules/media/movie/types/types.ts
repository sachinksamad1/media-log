/**
 * Re-export from shared package for backward compatibility.
 * New code should import directly from '@media-log/shared-types'
 */
export type { MovieStats, MovieDTO as Movie } from '@media-log/shared-types'

import type { ApiResponse, ApiMeta } from '@media-log/shared-types'
import type { MovieDTO } from '@media-log/shared-types'

// Movie User Stats - kept for backward compatibility
export interface MovieUserStats {
  score: number
  status: 'Planned' | 'Watching' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

// Movie Response
export interface MovieResponse extends ApiResponse<MovieDTO[]> {
  meta?: ApiMeta
}
