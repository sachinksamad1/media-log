export interface MovieUserStats {
  score: number
  status: 'Planned' | 'Watching' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

export interface MovieStats {
  releaseDate?: string
  runtimeMinutes?: number
  productionCompany?: string
}

export interface Movie {
  id: string
  title: string
  imageUrl: string
  origin?: string
  genres?: string[]
  language?: string
  createdAt: string
  updatedAt: string
  userStats: MovieUserStats

  // Movie specific
  director?: string
  cast: string[]
  movieStats: MovieStats
}

export interface MovieResponse {
  success: boolean
  message: string
  data: Movie[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
