import type { NonFictionDTO, NonFictionVolume, ApiResponse } from '@media-log/shared-types'

export type NonFictionVolumeDto = NonFictionVolume

export interface NonFictionUserStatsDto {
  score: number
  status: 'Completed' | 'Planned' | 'Reading' | string
}

export type NonFictionDto = NonFictionDTO

export type NonFictionResponseDto = ApiResponse<NonFictionDto[]>
