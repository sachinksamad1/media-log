export interface VolumeInfo {
  standalone: boolean
  seriesName?: string
  order: number
  total: number
  isCompleted: boolean
}

// User Stats
export interface UserStats {
  score: number
  status: 'Planned' | 'Reading' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

// NonFiction
export interface NonFiction {
  id: string
  title: string
  author: string
  origin: string
  genres: string[]
  format: 'E-Book' | 'Physical' | string
  published?: string
  volumes: VolumeInfo[]
  userStats: UserStats
  imageUrl: string
  createdAt?: string
  updatedAt?: string
}

// NonFiction Response
export interface NonFictionResponse {
  success: boolean
  message: string
  data: NonFiction[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
