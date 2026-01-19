import http from '@common/api/http'
import type { LightNovelResponse, LightNovel } from '@modules/media/lightNovel/types/types'
import type { LightNovelResponseDto, LightNovelDto } from '@modules/media/lightNovel/types/dtos'
import { LightNovelMapper } from '@modules/media/lightNovel/api/lightNovelMapper'

export const LightNovelService = {
  async getAll(limit?: number, cursor?: string, status?: string): Promise<LightNovelResponse> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (cursor) params.append('cursor', cursor)
    if (status) params.append('status', status)

    const { data } = await http.get<LightNovelResponseDto>(`/light-novel?${params.toString()}`)
    return { ...data, data: data.data.map(LightNovelMapper.toDomain) }
  },

  async create(lightNovel: Partial<LightNovel> | FormData): Promise<LightNovel> {
    const { data } = await http.post<LightNovelDto>('/light-novel', lightNovel)
    return LightNovelMapper.toDomain(data)
  },

  async update(id: string, lightNovel: Partial<LightNovel> | FormData): Promise<LightNovel> {
    const { data } = await http.patch<LightNovelDto>(`/light-novel/${id}`, lightNovel)
    return LightNovelMapper.toDomain(data)
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/light-novel/${id}`)
  },

  async search(query: string): Promise<LightNovel[]> {
    const params = new URLSearchParams()
    params.append('query', query)
    params.append('type', 'light-novel')

    const { data } = await http.get<{ data: LightNovelDto[] }>(`/search?${params.toString()}`)
    return data.data.map(LightNovelMapper.toDomain)
  },
}
