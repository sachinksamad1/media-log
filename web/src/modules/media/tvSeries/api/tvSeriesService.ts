import http from "@common/api/http";
import type { TvSeriesResponse, TvSeries } from "@modules/media/tvSeries/types/types";
import type { TvSeriesResponseDto, TvSeriesDto } from "@modules/media/tvSeries/types/dtos";
import { TvSeriesMapper } from "@modules/media/tvSeries/api/tvSeriesMapper";

export const TvSeriesService = {
  async getAll(
    limit?: number,
    cursor?: string,
    status?: string
  ): Promise<TvSeriesResponse> {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);
    if (status) params.append("status", status);

    const { data } = await http.get<TvSeriesResponseDto>(
      `/tv-series?${params.toString()}`
    );
    return { ...data, data: data.data.map(TvSeriesMapper.toDomain) };
  },

  async create(tvSeries: Partial<TvSeries> | FormData): Promise<TvSeries> {
    const { data } = await http.post<TvSeriesDto>("/tv-series", tvSeries);
    return TvSeriesMapper.toDomain(data);
  },

  async update(id: string, tvSeries: Partial<TvSeries> | FormData): Promise<TvSeries> {
    const { data } = await http.patch<TvSeriesDto>(`/tv-series/${id}`, tvSeries);
    return TvSeriesMapper.toDomain(data);
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/tv-series/${id}`);
  },

  async search(query: string): Promise<TvSeries[]> {
    const params = new URLSearchParams();
    params.append("query", query);
    params.append("type", "tv-series");

    const { data } = await http.get<{ data: TvSeriesDto[] }>(
      `/search?${params.toString()}`
    );
    return data.data.map(TvSeriesMapper.toDomain);
  },
};
