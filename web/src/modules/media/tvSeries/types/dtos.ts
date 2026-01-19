export interface TvSeriesUserStatsDto {
  score: number
  status: 'Completed' | 'Planned' | 'Watching' | 'Dropped' | 'On-Hold' | string
  watchedEpisodes?: number
  rewatchCount?: number
}

export interface TvSeriesDto {
  id: string
  title: string
  directors: string[]
  writers: string[]
  cast: string[]
  genres: string[]
  tvSeriesStats: {
    airingYear: string
    currentSeason: number
    totalSeasons: number
    totalEpisodes?: number
    isCompleted: boolean
  }
  language: string
  origin?: string
  userStats: TvSeriesUserStatsDto
  imageUrl: string
  network?: string
  studio?: string
  createdAt?: string
  updatedAt?: string
}

export interface TvSeriesResponseDto {
  success: boolean
  message: string
  data: TvSeriesDto[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
