// Game Stats
export interface GameUserStats {
  score: number
  playTime: number
  status: 'Planned' | 'Playing' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

export interface Playthrough {
  platformUsed: string
  isCompleted: boolean
  achievementsUnlocked?: number
}

export interface Game {
  id: string
  title: string
  developers: string[]
  publishers: string[]
  platforms: string[]
  genres: string[]
  playthroughs: Playthrough[]
  userStats: GameUserStats
  origin?: string
  language?: string
  imageUrl: string
  releaseDate?: string
  createdAt?: string
  updatedAt?: string
}

export interface GameResponse {
  success: boolean
  message: string
  data: Game[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
