import { defineStore } from 'pinia'
import type { Game } from '@modules/media/game/types/types'
import { GameService } from '@modules/media/game/api/gameService'

interface GameState {
  items: Game[]
  loading: boolean
  error: string | null
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    completed: (state) => state.items.filter((a) => a.userStats.status === 'Completed'),
    playing: (state) => state.items.filter((a) => a.userStats.status === 'Playing'),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const response = await GameService.getAll()
        this.items = response.data
      } catch {
        this.error = 'Failed to load games'
      } finally {
        this.loading = false
      }
    },

    async add(payload: Partial<Game> | FormData) {
      const created = await GameService.create(payload)
      this.items.unshift(created)
    },

    async update(id: string, payload: Partial<Game> | FormData) {
      const updated = await GameService.update(id, payload)
      this.items = this.items.map((i) => (i.id === id ? updated : i))
    },
  },
})
