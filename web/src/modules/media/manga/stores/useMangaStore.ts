import { defineStore } from "pinia";
import type { Manga } from "@/modules/media/manga/types/types";
import { MangaService } from "@/modules/media/manga/api/manga.service";

interface MangaState {
  items: Manga[];
  loading: boolean;
  error: string | null;
}

export const useMangaStore = defineStore("manga", {
  state: (): MangaState => ({
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
        const response = await MangaService.getAll();
        this.items = response.data;
      } catch (err) {
        this.error = "Failed to load manga";
      } finally {
        this.loading = false;
      }
    },

    async add(payload: Partial<Manga>) {
      const created = await MangaService.create(payload);
      this.items.unshift(created);
    },

    async update(id: string, payload: Partial<Manga>) {
      const updated = await MangaService.update(id, payload);
      this.items = this.items.map((i) => (i.id === id ? updated : i));
    },
  },
});
