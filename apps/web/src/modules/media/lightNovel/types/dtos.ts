import type {
  LightNovelDTO,
  LightNovelReleaseStats,
  LightNovelReadingStats,
  ApiResponse,
} from '@media-log/shared-types'

export type LightNovelReleaseStatsDto = LightNovelReleaseStats

export type LightNovelReadingStatsDto = LightNovelReadingStats

export interface LightNovelUserStatsDto {
  score: number
  status: 'Planned' | 'Reading' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

export type LightNovelDto = LightNovelDTO

export type LightNovelResponseDto = ApiResponse<LightNovelDto[]>
