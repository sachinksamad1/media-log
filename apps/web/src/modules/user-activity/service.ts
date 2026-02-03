import http from '@/common/api/http'
import type { UserActivity } from './types'

export const userActivityService = {
  async getRecent(limit = 10): Promise<UserActivity[]> {
    const response = await http.get<{ success: boolean; data: UserActivity[] }>('/user-activity', {
      params: { limit },
    })
    return response.data.data
  },
}
