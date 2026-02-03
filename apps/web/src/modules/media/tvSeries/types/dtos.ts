import type {
  TvSeriesDTO,
  TvSeriesUserStats,
  TvSeriesStats,
  ApiResponse,
} from '@media-log/shared-types'

export type TvSeriesUserStatsDto = TvSeriesUserStats

export type TvSeriesStatsDto = TvSeriesStats

export type TvSeriesDto = TvSeriesDTO

export type TvSeriesResponseDto = ApiResponse<TvSeriesDto[]>
