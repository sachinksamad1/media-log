import type { TvSeries } from '../types/types'
import type { TvSeriesDto } from '../types/dtos'

export const TvSeriesMapper = {
  toDomain(dto: TvSeriesDto): TvSeries {
    return {
      id: dto.id,
      title: dto.title,
      directors: dto.directors || [],
      writers: dto.writers || [],
      cast: dto.cast || [],
      genres: dto.genres || [],
      tvSeriesStats: dto.tvSeriesStats,
      language: dto.language,
      origin: dto.origin,
      network: dto.network,
      studio: dto.studio,
      userStats: dto.userStats,
      imageUrl: dto.imageUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }
  },

  toDto(domain: TvSeries): TvSeriesDto {
    return {
      id: domain.id,
      title: domain.title,
      directors: domain.directors,
      writers: domain.writers,
      cast: domain.cast,
      genres: domain.genres,
      tvSeriesStats: domain.tvSeriesStats,
      language: domain.language,
      origin: domain.origin,
      network: domain.network,
      studio: domain.studio,
      userStats: domain.userStats,
      imageUrl: domain.imageUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  },
}
