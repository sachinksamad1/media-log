import { defineStore } from 'pinia'
import { StatsService } from '@/common/services/stats.service'
import type { DashboardStats } from '../../../common/types/dashboard'
import { userActivityService } from '../../user-activity/service'
import type { UserActivity } from '../../user-activity/types'

interface DashboardState {
  stats: DashboardStats | null
  recentActivities: UserActivity[]
  loading: boolean
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    stats: null,
    recentActivities: [],
    loading: false,
  }),

  actions: {
    async fetchStats() {
      this.loading = true
      try {
        const response = await StatsService.getLibraryStats()
        this.stats = response.data as unknown as DashboardStats
      } finally {
        this.loading = false
      }
    },

    async fetchRecentActivities(limit = 10) {
      try {
        this.recentActivities = await userActivityService.getRecent(limit)
      } catch (error) {
        console.error('Failed to fetch recent activities:', error)
      }
    },
  },
})
