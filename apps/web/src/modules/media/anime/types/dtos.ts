import type { AnimeDTO, AnimeReleaseStats, ApiResponse } from '@media-log/shared-types'

export type AnimeReleaseStatsDto = AnimeReleaseStats

export interface AnimeUserStatsDto {
  score: number
  status: 'Completed' | 'Planned' | 'Ongoing' | string
}

export type AnimeDto = AnimeDTO

export type AnimeResponseDto = ApiResponse<AnimeDto[]>
