import { defineStore } from "pinia";
import type { Movie } from "@modules/media/movie/types/types";
import { MovieService } from "@modules/media/movie/api/movieService";

interface MovieState {
  items: Movie[];
  loading: boolean;
  error: string | null;
}

export const useMovieStore = defineStore("movie", {
  state: (): MovieState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    completed: (state) =>
      state.items.filter((a) => a.userStats.status === "Completed"),
    planToWatch: (state) =>
      state.items.filter((a) => a.userStats.status === "Plan to Watch"),
  },

  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const response = await MovieService.getAll();
        this.items = response.data;
      } catch (err) {
        this.error = "Failed to load movies";
      } finally {
        this.loading = false;
      }
    },

    async add(payload: Partial<Movie> | FormData) {
      const created = await MovieService.create(payload);
      this.items.unshift(created);
    },

    async update(id: string, payload: Partial<Movie> | FormData) {
      const updated = await MovieService.update(id, payload);
      this.items = this.items.map((i) => (i.id === id ? updated : i));
    },
  },
});
