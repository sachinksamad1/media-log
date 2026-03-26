import http from '@/common/api/http'

export const recommendationService = {
  async getRecommendations(limit = 10) {
    const response = await http.get('/recommendations', {
      params: { limit },
    })
    return response.data
  },
}
