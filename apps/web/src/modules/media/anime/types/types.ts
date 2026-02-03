export type { AnimeReleaseStats as ReleaseStats, AnimeDTO as Anime } from '@media-log/shared-types'

import type { ApiResponse, ApiMeta } from '@media-log/shared-types'
import type { AnimeDTO } from '@media-log/shared-types'

// User Stats - kept for backward compatibility
export interface UserStats {
  score: number
  status: 'Planned' | 'Watching' | 'Ongoing' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

// Anime Response
export interface AnimeResponse extends ApiResponse<AnimeDTO[]> {
  meta?: ApiMeta
}
