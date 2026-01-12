import type { AnimeResponse, Anime } from "../types";

const API_ANIME_URL = "http://localhost:3000/api/v1/anime";

export const AnimeService = {
  async getAll(): Promise<Anime[]> {
    try {
      const response = await fetch(API_ANIME_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: AnimeResponse = await response.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to fetch library");
      }

      return json.data;
    } catch (error) {
      console.error("AnimeService Error:", error);
      throw error;
    }
  },

  async create(anime: Partial<Anime>): Promise<Anime> {
    try {
      const response = await fetch(API_ANIME_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(anime),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to create anime");
      }

      return json.data;
    } catch (error) {
      console.error("AnimeService Create Error:", error);
      throw error;
    }
  },

  async update(id: string, anime: Partial<Anime>): Promise<Anime> {
    try {
      const response = await fetch(`${API_ANIME_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(anime),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to update anime");
      }

      return json.data;
    } catch (error) {
      console.error("AnimeService Update Error:", error);
      throw error;
    }
  },
};
