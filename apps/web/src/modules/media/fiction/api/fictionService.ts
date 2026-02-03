import http from '@common/api/http'
import type { FictionResponse, Fiction } from '@modules/media/fiction/types/types'
import type { FictionResponseDto, FictionDto } from '@modules/media/fiction/types/dtos'
import { FictionMapper } from '@modules/media/fiction/api/fictionMapper'

export const FictionService = {
  async getAll(limit?: number, cursor?: string, status?: string): Promise<FictionResponse> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (cursor) params.append('cursor', cursor)
    if (status) params.append('status', status)

    const { data } = await http.get<FictionResponseDto>(`/fiction?${params.toString()}`)
    return { ...data, data: data.data.map(FictionMapper.toDomain) }
  },

  async create(fiction: Partial<Fiction> | FormData): Promise<Fiction> {
    const { data } = await http.post<FictionDto>('/fiction', fiction)
    return FictionMapper.toDomain(data)
  },

  async update(id: string, fiction: Partial<Fiction> | FormData): Promise<Fiction> {
    const { data } = await http.patch<FictionDto>(`/fiction/${id}`, fiction)
    return FictionMapper.toDomain(data)
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/fiction/${id}`)
  },

  async search(query: string): Promise<Fiction[]> {
    const params = new URLSearchParams()
    params.append('query', query)
    params.append('type', 'fiction')

    const { data } = await http.get<{ data: FictionDto[] }>(`/search?${params.toString()}`)
    return data.data.map(FictionMapper.toDomain)
  },
}
