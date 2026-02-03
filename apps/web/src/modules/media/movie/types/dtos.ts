import type { MovieDTO, MovieStats, ApiResponse } from '@media-log/shared-types'

export type MovieStatsDto = MovieStats

export interface MovieUserStatsDto {
  score: number
  status: 'Completed' | 'Planned' | 'Watching' | 'Dropped' | string
}

export type MovieDto = MovieDTO

export type MovieResponseDto = ApiResponse<MovieDto[]>
