import type { Movie } from '../types/types'
import type { MovieDto } from '../types/dtos'

export const MovieMapper = {
  toDomain(dto: MovieDto): Movie {
    return {
      id: dto.id,
      title: dto.title,
      director: dto.director,
      cast: dto.cast,
      genres: dto.genres,
      movieStats: {
        releaseDate: dto.movieStats.releaseDate,
        runtimeMinutes: dto.movieStats.runtimeMinutes,
        productionCompany: dto.movieStats.productionCompany,
      },
      userStats: dto.userStats,
      language: dto.language,
      origin: dto.origin,
      imageUrl: dto.imageUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }
  },

  toDto(domain: Movie): MovieDto {
    return {
      id: domain.id,
      title: domain.title,
      director: domain.director,
      cast: domain.cast,
      genres: domain.genres,
      movieStats: domain.movieStats,
      language: domain.language,
      origin: domain.origin,
      userStats: domain.userStats,
      imageUrl: domain.imageUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  },
}
