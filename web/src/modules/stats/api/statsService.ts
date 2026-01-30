import http from '@/common/api/http'
import type { StatsApiResponse } from '../types/types'

export const statsService = {
  async getSummary(): Promise<StatsApiResponse> {
    const response = await http.get<StatsApiResponse>('/stats/summary')
    return response.data
  },
}
