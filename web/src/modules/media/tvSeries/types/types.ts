export interface TvSeriesUserStats {
  score: number
  status: 'Planned' | 'Watching' | 'Completed' | 'Dropped' | 'On-Hold' | string
  watchedEpisodes?: number
  rewatchCount?: number
}

export interface TvSeriesStats {
  airingYear: string
  currentSeason: number
  totalSeasons: number
  totalEpisodes?: number
  isCompleted: boolean
}

export interface TvSeries {
  id: string
  title: string
  directors: string[]
  writers: string[]
  cast: string[]
  genres: string[]
  tvSeriesStats: TvSeriesStats
  language: string
  origin?: string
  userStats: TvSeriesUserStats
  imageUrl: string
  network?: string
  studio?: string
  createdAt?: string
  updatedAt?: string
}

export interface TvSeriesResponse {
  success: boolean
  message: string
  data: TvSeries[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
