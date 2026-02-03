/**
 * Re-export from shared package for backward compatibility.
 * New code should import directly from '@media-log/shared-types'
 */
export type {
  MangaReleaseStats as ReleaseStats,
  MangaReadingStats as ReadingStats,
  MangaDTO as Manga,
} from '@media-log/shared-types'

import type { ApiResponse, ApiMeta } from '@media-log/shared-types'
import type { MangaDTO } from '@media-log/shared-types'

// User Stats - kept for backward compatibility
export interface UserStats {
  score: number
  status: 'Planned' | 'Reading' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

// Manga Response
export interface MangaResponse extends ApiResponse<MangaDTO[]> {
  meta?: ApiMeta
}
