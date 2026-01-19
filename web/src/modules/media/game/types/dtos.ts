export interface GameUserStatsDto {
  score: number
  status: 'Completed' | 'Playing' | 'Planned' | 'Dropped' | string
  playTime?: number // Hours
}

export interface GameDto {
  id: string
  title: string
  developer: string
  publisher: string
  platforms: string[]
  genres: string[]
  releaseDate?: string
  userStats: GameUserStatsDto
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
