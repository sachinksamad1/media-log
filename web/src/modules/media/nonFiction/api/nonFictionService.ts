import http from '@common/api/http'
import type { NonFictionResponse, NonFiction } from '@modules/media/nonFiction/types/types'
import type { NonFictionResponseDto, NonFictionDto } from '@modules/media/nonFiction/types/dtos'
import { NonFictionMapper } from '@modules/media/nonFiction/api/nonFictionMapper'

export const NonFictionService = {
  async getAll(limit?: number, cursor?: string, status?: string): Promise<NonFictionResponse> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (cursor) params.append('cursor', cursor)
    if (status) params.append('status', status)

    const { data } = await http.get<NonFictionResponseDto>(`/non-fiction?${params.toString()}`)
    return { ...data, data: data.data.map(NonFictionMapper.toDomain) }
  },

  async create(nonFiction: Partial<NonFiction> | FormData): Promise<NonFiction> {
    const { data } = await http.post<NonFictionDto>('/non-fiction', nonFiction)
    return NonFictionMapper.toDomain(data)
  },

  async update(id: string, nonFiction: Partial<NonFiction> | FormData): Promise<NonFiction> {
    const { data } = await http.patch<NonFictionDto>(`/non-fiction/${id}`, nonFiction)
    return NonFictionMapper.toDomain(data)
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/non-fiction/${id}`)
  },

  async search(query: string): Promise<NonFiction[]> {
    const params = new URLSearchParams()
    params.append('query', query)
    params.append('type', 'non-fiction')

    const { data } = await http.get<{ data: NonFictionDto[] }>(`/search?${params.toString()}`)
    return data.data.map(NonFictionMapper.toDomain)
  },
}
