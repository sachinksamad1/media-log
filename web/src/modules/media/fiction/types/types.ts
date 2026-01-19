// Release Stats
// Publication Info
export interface PublicationInfo {
  published?: string // Date or string
  volumes: number
  status: 'Completed' | 'Ongoing' | 'Hiatus' | string
}

// User Stats
export interface UserStats {
  score: number
  status: 'Planned' | 'Reading' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

// Fiction
export interface Fiction {
  id: string
  title: string
  author: string
  illustrator?: string
  origin: string
  genres: string[]
  type: 'Novel' | 'Short Story' | string
  format: 'E-Book' | 'Physical' | string
  publicationInfo: PublicationInfo
  userStats: UserStats
  imageUrl: string
  createdAt?: string
  updatedAt?: string
}

// Fiction Response
export interface FictionResponse {
  success: boolean
  message: string
  data: Fiction[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
