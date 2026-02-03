import http from '@common/api/http'
import type { AnimeResponse, Anime } from '@modules/media/anime/types/types'
import type { AnimeResponseDto, AnimeDto } from '@modules/media/anime/types/dtos'
import { AnimeMapper } from '@modules/media/anime/api/animeMapper'

export const AnimeService = {
  async getAll(limit?: number, cursor?: string, status?: string): Promise<AnimeResponse> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (cursor) params.append('cursor', cursor)
    if (status) params.append('status', status)

    const { data } = await http.get<AnimeResponseDto>(`/anime?${params.toString()}`)

    return {
      ...data,
      data: data.data.map(AnimeMapper.toDomain),
    }
  },

  async create(anime: Partial<Anime> | FormData): Promise<Anime> {
    const { data } = await http.post<AnimeDto>('/anime', anime)
    return AnimeMapper.toDomain(data)
  },

  async update(id: string, anime: Partial<Anime> | FormData): Promise<Anime> {
    const { data } = await http.patch<AnimeDto>(`/anime/${id}`, anime)
    return AnimeMapper.toDomain(data)
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/anime/${id}`)
  },

  async search(query: string): Promise<Anime[]> {
    const params = new URLSearchParams()
    params.append('query', query)
    params.append('type', 'anime')

    // Search endpoint usually returns { data: Item[] }
    // We should probably define a generic SearchResponse<T> or just use { data: AnimeDto[] }
    const { data } = await http.get<{ data: AnimeDto[] }>(`/search?${params.toString()}`)
    return data.data.map(AnimeMapper.toDomain)
  },
}
