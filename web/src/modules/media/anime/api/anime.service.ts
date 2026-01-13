import http from "@api/http";
import type { AnimeResponse, Anime } from "../types/types";

export const AnimeService = {
  async getAll(limit?: number, cursor?: string, status?: string): Promise<AnimeResponse> {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);
    if (status) params.append("status", status);

    const response = await http.get<AnimeResponse>(`/anime?${params.toString()}`);
    return response.data;
  },

  async create(anime: Partial<Anime>): Promise<Anime> {
    return http.post("/anime", anime);
  },

  async update(id: string, anime: Partial<Anime>): Promise<Anime> {
    return http.put(`/anime/${id}`, anime);
  },

  async delete(id: string): Promise<void> {
    return http.delete(`/anime/${id}`);
  },
}