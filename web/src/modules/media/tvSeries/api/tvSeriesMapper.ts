import type { TvSeries } from '../types/types';
import type { TvSeriesDto } from '../types/dtos';

export const TvSeriesMapper = {
  toDomain(dto: TvSeriesDto): TvSeries {
    return {
      id: dto.id,
      title: dto.title,
      director: dto.director,
      producer: dto.producer,
      studio: dto.studio,
      network: dto.network,
      cast: dto.cast,
      genres: dto.genres,
      releaseDate: dto.releaseDate,
      endDate: dto.endDate,
      episodes: dto.episodes,
      language: dto.language,
      country: dto.country,
      userStats: dto.userStats,
      imageUrl: dto.imageUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  },

  toDto(domain: TvSeries): TvSeriesDto {
    return {
      id: domain.id,
      title: domain.title,
      director: domain.director,
      producer: domain.producer,
      studio: domain.studio,
      network: domain.network,
      cast: domain.cast,
      genres: domain.genres,
      releaseDate: domain.releaseDate,
      endDate: domain.endDate,
      episodes: domain.episodes,
      language: domain.language,
      country: domain.country,
      userStats: domain.userStats,
      imageUrl: domain.imageUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
};
