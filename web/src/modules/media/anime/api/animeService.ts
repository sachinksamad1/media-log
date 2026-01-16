import http from "@/common/api/http";
import type { AnimeResponse, Anime } from "@/modules/media/anime/types/types";

export const AnimeService = {
  async getAll(
    limit?: number,
    cursor?: string,
    status?: string
  ): Promise<AnimeResponse> {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);
    if (status) params.append("status", status);

    const response = await http.get<AnimeResponse>(
      `/anime?${params.toString()}`
    );
    return response.data;
  },

  async create(anime: Partial<Anime> | FormData): Promise<Anime> {
    return http.post("/anime", anime);
  },

  async update(id: string, anime: Partial<Anime> | FormData): Promise<Anime> {
    return http.patch(`/anime/${id}`, anime);
  },

  async delete(id: string): Promise<void> {
    return http.delete(`/anime/${id}`);
  },

  async search(query: string): Promise<Anime[]> {
    const params = new URLSearchParams();
    params.append("query", query);
    params.append("type", "anime");

    const response = await http.get<{ data: Anime[] }>(
      `/search?${params.toString()}`
    );
    return response.data.data;
  },
};