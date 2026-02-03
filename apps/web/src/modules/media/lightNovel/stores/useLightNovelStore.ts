import { defineStore } from 'pinia'
import type { LightNovel } from '@/modules/media/lightNovel/types/types'
import { LightNovelService } from '@/modules/media/lightNovel/api/lightNovelService'

interface LightNovelState {
  items: LightNovel[]
  loading: boolean
  error: string | null
}

export const useLightNovelStore = defineStore('lightNovel', {
  state: (): LightNovelState => ({
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
        const response = await LightNovelService.getAll()
        this.items = response.data
      } catch {
        this.error = 'Failed to load light novels'
      } finally {
        this.loading = false
      }
    },

    async add(payload: Partial<LightNovel> | FormData) {
      const created = await LightNovelService.create(payload)
      this.items.unshift(created)
    },

    async update(id: string, payload: Partial<LightNovel> | FormData) {
      const updated = await LightNovelService.update(id, payload)
      this.items = this.items.map((i) => (i.id === id ? updated : i))
    },
  },
})
