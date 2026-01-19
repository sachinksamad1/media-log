import { defineStore } from 'pinia'
import { AnalyticsService } from '@/services/analytics.service'
import { DashboardStats } from '../../../common/types/dashboard'

interface DashboardState {
  stats: DashboardStats | null
  loading: boolean
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    stats: null,
    loading: false,
  }),

  actions: {
    async fetchStats() {
      this.loading = true
      try {
        this.stats = await AnalyticsService.getDashboardStats()
      } finally {
        this.loading = false
      }
    },
  },
})
