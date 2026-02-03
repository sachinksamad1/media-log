import type { MangaDTO, MangaReleaseStats, ApiResponse } from '@media-log/shared-types'

export type MangaReleaseStatsDto = MangaReleaseStats

export interface MangaUserStatsDto {
  score: number
  status: 'Completed' | 'Planned' | 'Reading' | string
}

export type MangaDto = MangaDTO

export type MangaResponseDto = ApiResponse<MangaDto[]>
