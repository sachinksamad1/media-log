import type {
  FictionDTO,
  FictionPublicationInfo,
  FictionReadingStats,
  ApiResponse,
} from '@media-log/shared-types'

export type FictionPublicationInfoDto = FictionPublicationInfo

export type FictionReadingStatsDto = FictionReadingStats

export interface FictionUserStatsDto {
  score: number
  status: 'Completed' | 'Planned' | 'Reading' | string
}

export type FictionDto = FictionDTO

export type FictionResponseDto = ApiResponse<FictionDto[]>
