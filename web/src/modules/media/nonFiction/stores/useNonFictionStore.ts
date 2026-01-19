import { defineStore } from 'pinia'
import type { NonFiction } from '@modules/media/nonFiction/types/types'
import { NonFictionService } from '@modules/media/nonFiction/api/nonFictionService'

interface NonFictionState {
  items: NonFiction[]
  loading: boolean
  error: string | null
}

export const useNonFictionStore = defineStore('nonFiction', {
  state: (): NonFictionState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    completed: (state) => state.items.filter((a) => a.userStats.status === 'Completed'),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const response = await NonFictionService.getAll()
        this.items = response.data
      } catch (err) {
        this.error = 'Failed to load non-fiction'
      } finally {
        this.loading = false
      }
    },

    async add(payload: Partial<NonFiction> | FormData) {
      const created = await NonFictionService.create(payload)
      this.items.unshift(created)
    },

    async update(id: string, payload: Partial<NonFiction> | FormData) {
      const updated = await NonFictionService.update(id, payload)
      this.items = this.items.map((i) => (i.id === id ? updated : i))
    },
  },
})
