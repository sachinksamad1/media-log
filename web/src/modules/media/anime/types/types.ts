// Release Stats
// Release Stats
export interface ReleaseStats {
  airingYear: string
  totalEpisodes: number
  totalSeasons: number
  isCompleted: boolean
}

// User Stats
export interface UserStats {
  score: number
  status: 'Planned' | 'Watching' | 'Ongoing' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

// Anime Schema
export interface Anime {
  id: string
  title: string
  genres: string[]
  origin: string
  language: string
  releaseStats: ReleaseStats
  userStats: UserStats
  imageUrl: string
  createdAt: string
  updatedAt: string
}

// Anime Response
export interface AnimeResponse {
  success: boolean
  message: string
  data: Anime[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
