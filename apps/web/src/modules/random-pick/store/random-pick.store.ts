import { defineStore } from 'pinia'
import { searchService } from '@/modules/search/api/searchService'
import type { GlobalSearchResponse } from '@/modules/search/types'

export const useRandomPickStore = defineStore('random-pick', {
  state: () => ({
    result: null as GlobalSearchResponse | null,
    loading: false,
    error: null as string | null,
    currentFilter: 'all',
  }),

  actions: {
    async fetchRandom(type?: string) {
      this.loading = true
      this.error = null
      try {
        const filter = type || this.currentFilter
        this.result = await searchService.getRandom(filter)
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch random pick'
        console.error('Error fetching random pick:', err)
      } finally {
        this.loading = false
      }
    },

    setFilter(filter: string) {
      this.currentFilter = filter
    },
  },
})
