import http from '@common/api/http'

export interface NoteResponse {
  id: string
  mediaId: string
  mediaType: string
  userId: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T> {
  data: T
  message: string
}

export const NoteService = {
  async getByMediaId(mediaId: string): Promise<NoteResponse[]> {
    const { data } = await http.get<ApiResponse<NoteResponse[]>>(`/notes/media/${mediaId}`)
    return data.data
  },

  async create(
    mediaId: string,
    mediaType: string,
    title: string,
    content: string
  ): Promise<NoteResponse> {
    const { data } = await http.post<ApiResponse<NoteResponse>>('/notes', {
      mediaId,
      mediaType,
      title,
      content,
    })
    return data.data
  },

  async update(id: string, content: string, title?: string): Promise<NoteResponse> {
    const payload: Record<string, string> = { content }
    if (title !== undefined) payload.title = title
    const { data } = await http.put<ApiResponse<NoteResponse>>(`/notes/${id}`, payload)
    return data.data
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/notes/${id}`)
  },
}
