// Release Stats
// Release Stats
export interface ReleaseStats {
  chaptersPublished: number
  volumesPublished: number
  releaseStatus: 'Ongoing' | 'Completed' | 'Hiatus' | 'Cancelled' | string
}

// User Stats
export interface UserStats {
  score: number
  status: 'Planned' | 'Reading' | 'Completed' | 'Dropped' | 'On-Hold' | string
}

export interface ReadingStats {
  currentReadingChapter: number
  currentReadingVolume: number
}

// Manga Schmea
export interface Manga {
  id: string
  title: string
  author: string
  illustrator: string
  origin: string
  genres: string[]
  type: 'Manga' | 'Manhwa' | 'Manhua' | 'One-shot' | 'Doujinshi' | string
  format: 'Physical' | 'Digital' | 'Magazine' | string
  releaseStats: ReleaseStats
  readingStats?: ReadingStats
  userStats: UserStats
  imageUrl: string
  createdAt: string
  updatedAt: string
}

// Manga Response
export interface MangaResponse {
  success: boolean
  message: string
  data: Manga[]
  meta?: {
    totalItems: number
    nextCursor: string | null
    count?: number
  }
}
