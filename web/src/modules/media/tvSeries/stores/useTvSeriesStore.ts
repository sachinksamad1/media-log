import { defineStore } from 'pinia'
import type { TvSeries } from '@modules/media/tvSeries/types/types'
import { TvSeriesService } from '@modules/media/tvSeries/api/tvSeriesService'

interface TvSeriesState {
  items: TvSeries[]
  loading: boolean
  error: string | null
}

export const useTvSeriesStore = defineStore('tvSeries', {
  state: (): TvSeriesState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    completed: (state) => state.items.filter((a) => a.userStats.status === 'Completed'),
    watching: (state) => state.items.filter((a) => a.userStats.status === 'Watching'),
    planToWatch: (state) => state.items.filter((a) => a.userStats.status === 'Plan to Watch'),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const response = await TvSeriesService.getAll()
        this.items = response.data
      } catch {
        this.error = 'Failed to load TV Series'
      } finally {
        this.loading = false
      }
    },

    async add(payload: Partial<TvSeries> | FormData) {
      const created = await TvSeriesService.create(payload)
      this.items.unshift(created)
    },

    async update(id: string, payload: Partial<TvSeries> | FormData) {
      const updated = await TvSeriesService.update(id, payload)
      this.items = this.items.map((i) => (i.id === id ? updated : i))
    },
  },
})
