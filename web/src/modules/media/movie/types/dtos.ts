export interface MovieUserStatsDto {
  score: number
  status: 'Completed' | 'Planned' | 'Watching' | 'Dropped' | string
  watchedDate?: string
  rewatchCount?: number
}

export interface MovieDto {
  id: string
  title: string
  director?: string
  cast: string[]
  genres?: string[]
  movieStats: {
    releaseDate?: string
    runtimeMinutes?: number
    productionCompany?: string
  }
  language?: string
  origin?: string
  userStats: MovieUserStatsDto
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface MovieResponseDto {
  success: boolean
  message: string
  data: MovieDto[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
