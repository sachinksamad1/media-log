import http from '@common/api/http'
import type { MovieResponse, Movie } from '@modules/media/movie/types/types'
import type { MovieResponseDto, MovieDto } from '@modules/media/movie/types/dtos'
import { MovieMapper } from '@modules/media/movie/api/movieMapper'

export const MovieService = {
  async getAll(limit?: number, cursor?: string, status?: string): Promise<MovieResponse> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (cursor) params.append('cursor', cursor)
    if (status) params.append('status', status)

    const { data } = await http.get<MovieResponseDto>(`/movie?${params.toString()}`)
    return { ...data, data: data.data.map(MovieMapper.toDomain) }
  },

  async create(movie: Partial<Movie> | FormData): Promise<Movie> {
    const { data } = await http.post<{ data: MovieDto }>('/movie', movie)
    return MovieMapper.toDomain(data.data)
  },

  async update(id: string, movie: Partial<Movie> | FormData): Promise<Movie> {
    const { data } = await http.patch<{ data: MovieDto }>(`/movie/${id}`, movie)
    return MovieMapper.toDomain(data.data)
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/movie/${id}`)
  },

  async search(query: string): Promise<Movie[]> {
    const params = new URLSearchParams()
    params.append('query', query)
    params.append('type', 'movie')

    const { data } = await http.get<{ data: MovieDto[] }>(`/search?${params.toString()}`)
    return data.data.map(MovieMapper.toDomain)
  },
}
