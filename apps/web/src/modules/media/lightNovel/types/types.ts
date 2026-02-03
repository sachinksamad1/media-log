/**
 * Re-export from shared package for backward compatibility.
 * New code should import directly from '@media-log/shared-types'
 */
export type {
  LightNovelReleaseStats as ReleaseStats,
  LightNovelReadingStats,
  LightNovelDTO as LightNovel,
} from '@media-log/shared-types'

import type { ApiResponse, ApiMeta } from '@media-log/shared-types'
import type { LightNovelDTO } from '@media-log/shared-types'

// User Stats - kept for backward compatibility
export interface UserStats {
  score: number
  status: 'Planned' | 'Reading' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

// LightNovel Response
export interface LightNovelResponse extends ApiResponse<LightNovelDTO[]> {
  meta?: ApiMeta
}
