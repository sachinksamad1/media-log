export interface NonFictionReleaseStatsDto {
  releaseStatus: 'Ongoing' | 'Completed' | 'Hiatus' | 'Cancelled' | string
  volumes: number
}

export interface NonFictionUserStatsDto {
  score: number
  status: 'Completed' | 'Planned' | 'Ongoing' | string
}

export interface NonFictionDto {
  id: string
  title: string
  author: string
  illustrator: string
  origin: string
  genres: string[]
  type: 'Series' | 'Standalone' | string
  format: 'Physical' | 'Digital' | 'Audiobook' | 'Hardcover' | 'Paperback' | string
  releaseStats: NonFictionReleaseStatsDto
  userStats: NonFictionUserStatsDto
  readingStats?: { currentReadingVolume: number }
  imageUrl: string
  createdAt?: string
  updatedAt?: string
}

export interface NonFictionResponseDto {
  success: boolean
  message: string
  data: NonFictionDto[]
  meta?: {
    totalItems?: number
    nextCursor?: string | null
    count?: number
  }
}
