export interface MangaReleaseStatsDto {
  chapterPublished: number
  volumePublished: number
  releaseStatus: 'Ongoing' | 'Completed' | 'Hiatus' | 'Cancelled' | string
}

export interface MangaUserStatsDto {
  score: number
  status: 'Completed' | 'Planned' | 'Ongoing' | string
}

export interface MangaDto {
  id: string
  title: string
  author: string
  illustrator: string
  origin: string
  genres: string[]
  type: 'Manga' | 'Manhwa' | 'Manhua' | 'One-shot' | 'Doujinshi' | string
  format: 'Physical' | 'Digital' | 'Magazine' | string
  releaseStats: MangaReleaseStatsDto
  userStats: MangaUserStatsDto
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface MangaResponseDto {
  success: boolean
  message: string
  data: MangaDto[]
  meta?: {
    totalItems: number
    nextCursor: string | null
    count?: number
  }
}
