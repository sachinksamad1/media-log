import { defineStore } from "pinia";
import type { Fiction } from "@modules/media/fiction/types/types";
import { FictionService } from "@modules/media/fiction/api/fictionService";

interface FictionState {
  items: Fiction[];
  loading: boolean;
  error: string | null;
}

export const useFictionStore = defineStore("fiction", {
  state: (): FictionState => ({
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
        const response = await FictionService.getAll();
        this.items = response.data;
      } catch (err) {
        this.error = "Failed to load fiction";
      } finally {
        this.loading = false;
      }
    },

    async add(payload: Partial<Fiction> | FormData) {
      const created = await FictionService.create(payload);
      this.items.unshift(created);
    },

    async update(id: string, payload: Partial<Fiction> | FormData) {
      const updated = await FictionService.update(id, payload);
      this.items = this.items.map((i) => (i.id === id ? updated : i));
    },
  },
});
