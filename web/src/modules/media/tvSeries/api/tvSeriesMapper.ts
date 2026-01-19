import type { TvSeries } from '../types/types'
import type { TvSeriesDto } from '../types/dtos'

export const TvSeriesMapper = {
  toDomain(dto: TvSeriesDto): TvSeries {
    return {
      id: dto.id,
      title: dto.title,
      directors: dto.director ? [dto.director] : [],
      writers: [], // Not present in DTO
      cast: dto.cast,
      genres: dto.genres,
      tvSeriesStats: {
        airingYear: dto.releaseDate?.split('-')[0] || 'Unknown',
        currentSeason: 1, // Default
        totalSeasons: 1, // Default
        totalEpisodes: dto.episodes,
        isCompleted: !!dto.endDate,
      },
      language: dto.language,
      origin: dto.country,
      network: dto.network,
      studio: dto.studio,
      userStats: {
        ...dto.userStats,
        watchedEpisodes: dto.userStats.watchedEpisodes || 0,
      },
      imageUrl: dto.imageUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }
  },

  toDto(domain: TvSeries): TvSeriesDto {
    return {
      id: domain.id,
      title: domain.title,
      director: domain.directors.join(', '),
      producer: '', // Not present in Domain
      studio: domain.studio || '',
      network: domain.network || '',
      cast: domain.cast,
      genres: domain.genres,
      // releaseDate and endDate are optional in DTO, and we only have airingYear in domain
      episodes: domain.tvSeriesStats.totalEpisodes,
      language: domain.language,
      country: domain.origin || '',
      userStats: domain.userStats,
      imageUrl: domain.imageUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  },
}
