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
  director: string
  cast: string[]
  genres: string[]
  movieStats: MovieStats
  userStats: MovieUserStats
  language?: string
  origin?: string
  imageUrl: string
  createdAt?: string
  updatedAt?: string
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
