/**
 * Re-export from shared package for backward compatibility.
 * New code should import directly from '@media-log/shared-types'
 */
export type {
  NonFictionVolume as VolumeInfo,
  NonFictionDTO as NonFiction,
} from '@media-log/shared-types'

import type { ApiResponse, ApiMeta } from '@media-log/shared-types'
import type { NonFictionDTO } from '@media-log/shared-types'

// User Stats - kept for backward compatibility
export interface UserStats {
  score: number
  status: 'Planned' | 'Reading' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

// NonFiction Response
export interface NonFictionResponse extends ApiResponse<NonFictionDTO[]> {
  meta?: ApiMeta
}
