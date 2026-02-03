/**
 * Re-export from shared package for backward compatibility.
 * New code should import directly from '@media-log/shared-types'
 */
export type {
  FictionPublicationInfo as PublicationInfo,
  FictionReadingStats,
  FictionDTO as Fiction,
} from '@media-log/shared-types'

import type { ApiResponse, ApiMeta } from '@media-log/shared-types'
import type { FictionDTO } from '@media-log/shared-types'

// User Stats - kept for backward compatibility
export interface UserStats {
  score: number
  status: 'Planned' | 'Reading' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

// Fiction Response
export interface FictionResponse extends ApiResponse<FictionDTO[]> {
  meta?: ApiMeta
}
