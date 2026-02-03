export interface AnimeReleaseStatsDto {
  airingStarted?: string | null
  airingEnded?: string | null
  totalEpisodes: number
  totalSeasons: number
  isCompleted: boolean
}

export interface AnimeUserStatsDto {
  score: number
  status: 'Completed' | 'Planned' | 'Ongoing' | string
}

export interface AnimeDto {
  id: string
  title: string
  genres: string[]
  origin: string
  language: string
  releaseStats?: AnimeReleaseStatsDto
  userStats?: AnimeUserStatsDto
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AnimeResponseDto {
  success: boolean
  message: string
  data: AnimeDto[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
