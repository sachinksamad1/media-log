export interface GameUserStatsDto {
  score: number
  status: 'Completed' | 'Playing' | 'Planned' | 'Dropped' | string
  playTime?: number // Hours
}

export interface GameDto {
  id: string
  title: string
  developers: string[]
  publishers: string[]
  platforms: string[]
  genres: string[]
  releaseDate?: string // Not in backend schema, but keeping optional
  userStats: GameUserStatsDto
  language?: string
  origin?: string
  imageUrl: string
  createdAt?: string
  updatedAt?: string
}

export interface GameResponseDto {
  success: boolean
  message: string
  data: GameDto[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
