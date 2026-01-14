import { defineStore } from "pinia";
import type { Anime } from "@/modules/media/anime/types/types";
import { AnimeService } from "@/modules/media/anime/api/animeService";

interface AnimeState {
  items: Anime[];
  loading: boolean;
  error: string | null;
}

export const useAnimeStore = defineStore("anime", {
  state: (): AnimeState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    completed: (state) =>
      state.items.filter((a) => a.userStats.status === "Completed"),
  },

  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const response = await AnimeService.getAll();
        this.items = response.data;
      } catch (err) {
        this.error = "Failed to load anime";
      } finally {
        this.loading = false;
      }
    },

    async add(payload: Partial<Anime>) {
      const created = await AnimeService.create(payload);
      this.items.unshift(created);
    },

    async update(id: string, payload: Partial<Anime>) {
      const updated = await AnimeService.update(id, payload);
      this.items = this.items.map((i) => (i.id === id ? updated : i));
    },
  },
});
