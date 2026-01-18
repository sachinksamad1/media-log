import http from "@common/api/http";
import type { MangaResponse, Manga } from "@modules/media/manga/types/types";
import type { MangaResponseDto, MangaDto } from "@modules/media/manga/types/dtos";
import { MangaMapper } from "@modules/media/manga/api/mangaMapper";

export const MangaService = {
  async getAll(
    limit?: number,
    cursor?: string,
    status?: string
  ): Promise<MangaResponse> {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);
    if (status) params.append("status", status);

    const { data } = await http.get<MangaResponseDto>(
      `/manga?${params.toString()}`
    );
    return { ...data, data: data.data.map(MangaMapper.toDomain) };
  },

  async create(manga: Partial<Manga> | FormData): Promise<Manga> {
    const { data } = await http.post<MangaDto>("/manga", manga);
    return MangaMapper.toDomain(data);
  },

  async update(id: string, manga: Partial<Manga> | FormData): Promise<Manga> {
    const { data } = await http.patch<MangaDto>(`/manga/${id}`, manga);
    return MangaMapper.toDomain(data);
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/manga/${id}`);
  },

  async search(query: string): Promise<Manga[]> {
    const params = new URLSearchParams();
    params.append("query", query);
    params.append("type", "manga");

    const { data } = await http.get<{ data: MangaDto[] }>(
      `/search?${params.toString()}`
    );
    return data.data.map(MangaMapper.toDomain);
  },
};
