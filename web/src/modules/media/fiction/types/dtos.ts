export interface FictionReleaseStatsDto {
  published?: string
  series: string
  volumes: number
  releaseStatus: 'Ongoing' | 'Completed' | 'Hiatus' | 'Cancelled' | string
}

export interface FictionUserStatsDto {
  score: number
  status: 'Completed' | 'Planned' | 'Ongoing' | string
}

export interface FictionDto {
  id: string
  title: string
  author: string
  origin?: string
  genres: string[]
  type: 'Series' | 'Standalone' | string
  format: 'Physical' | 'Digital' | 'Audiobook' | 'Hardcover' | 'Paperback' | string
  publicationInfo: {
    published?: string
    volumes: number
    status: string
  }
  userStats: FictionUserStatsDto
  readingStats?: { currentReadingVolume: number }
  imageUrl: string
  createdAt?: string
  updatedAt?: string
}

export interface FictionResponseDto {
  success: boolean
  message: string
  data: FictionDto[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
