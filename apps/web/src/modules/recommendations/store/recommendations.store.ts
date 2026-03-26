import { defineStore } from 'pinia'
import { recommendationService } from '../services/recommendation.service'

export interface RecommendedMedia {
  id: string
  title: string
  genres: string[]
  imageUrl: string
  score: number
  origin?: string
  language?: string
}

interface RecommendationsState {
  recommendations: RecommendedMedia[]
  loading: boolean
  error: string | null
}

export const useRecommendationsStore = defineStore('recommendations', {
  state: (): RecommendationsState => ({
    recommendations: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchRecommendations(limit = 10) {
      this.loading = true
      this.error = null
      try {
        const response = await recommendationService.getRecommendations(limit)
        this.recommendations = response.data
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch recommendations'
        console.error('Error fetching recommendations:', err)
      } finally {
        this.loading = false
      }
    },
  },
})
