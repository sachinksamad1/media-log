export interface GlobalSearchResponse {
  id: string
  title: string
  imageUrl: string
  createdAt: string
  updatedAt: string
  userStats: {
    score: number
    status: string
  }
  mediaType: string
}
