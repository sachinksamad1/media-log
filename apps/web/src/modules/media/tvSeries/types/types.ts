/**
 * Re-export from shared package for backward compatibility.
 * New code should import directly from '@media-log/shared-types'
 */
export type {
  TvSeriesUserStats,
  TvSeriesStats,
  TvSeriesDTO as TvSeries,
} from '@media-log/shared-types'

import type { ApiResponse, ApiMeta } from '@media-log/shared-types'
import type { TvSeriesDTO } from '@media-log/shared-types'

// TV Series Response
export interface TvSeriesResponse extends ApiResponse<TvSeriesDTO[]> {
  meta?: ApiMeta
}
