import http from '@common/api/http'
import type { MangaResponse, Manga } from '@/modules/media/manga/types/types'

export const MangaService = {
  async getAll(limit?: number, cursor?: string, status?: string): Promise<MangaResponse> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (cursor) params.append('cursor', cursor)
    if (status) params.append('status', status)

    const response = await http.get<MangaResponse>(`/manga?${params.toString()}`)
    return response.data
  },

  async create(manga: Partial<Manga> | FormData): Promise<Manga> {
    return http.post('/manga', manga)
  },

  async update(id: string, manga: Partial<Manga> | FormData): Promise<Manga> {
    return http.patch(`/manga/${id}`, manga)
  },

  async delete(id: string): Promise<void> {
    return http.delete(`/manga/${id}`)
  },

  async search(query: string): Promise<Manga[]> {
    const params = new URLSearchParams()
    params.append('query', query)
    params.append('type', 'manga')

    const response = await http.get<{ data: Manga[] }>(`/search?${params.toString()}`)
    return response.data.data
  },
}
