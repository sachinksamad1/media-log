import type { Movie } from '../types/types';
import type { MovieDto } from '../types/dtos';

export const MovieMapper = {
  toDomain(dto: MovieDto): Movie {
    return {
      id: dto.id,
      title: dto.title,
      director: dto.director,
      producer: dto.producer,
      studio: dto.studio,
      cast: dto.cast,
      genres: dto.genres,
      releaseDate: dto.releaseDate,
      duration: dto.duration,
      language: dto.language,
      country: dto.country,
      userStats: dto.userStats,
      imageUrl: dto.imageUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  },

  toDto(domain: Movie): MovieDto {
    return {
      id: domain.id,
      title: domain.title,
      director: domain.director,
      producer: domain.producer,
      studio: domain.studio,
      cast: domain.cast,
      genres: domain.genres,
      releaseDate: domain.releaseDate,
      duration: domain.duration,
      language: domain.language,
      country: domain.country,
      userStats: domain.userStats,
      imageUrl: domain.imageUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
};
