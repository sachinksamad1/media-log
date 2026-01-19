export interface TvSeriesUserStatsDto {
  score: number
  status: 'Completed' | 'Plan to Watch' | 'Watching' | 'Dropped' | 'On Hold' | string
  watchedEpisodes?: number
  rewatchCount?: number
}

export interface TvSeriesDto {
  id: string
  title: string
  director: string
  producer: string
  studio: string
  network: string
  cast: string[]
  genres: string[]
  releaseDate?: string
  endDate?: string
  episodes?: number
  language: string
  country: string
  userStats: TvSeriesUserStatsDto
  imageUrl: string
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
