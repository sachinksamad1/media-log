import type { Anime } from '../types/types'
import type { AnimeDto } from '../types/dtos'

export const AnimeMapper = {
  toDomain(dto: AnimeDto): Anime {
    return {
      id: dto.id,
      title: dto.title,
      genres: dto.genres,
      origin: dto.origin,
      language: dto.language,
      releaseStats: {
        airingStarted: dto.releaseStats?.airingStarted ?? '',
        airingEnded: dto.releaseStats?.airingEnded ?? '',
        totalEpisodes: dto.releaseStats?.totalEpisodes ?? 0,
        totalSeasons: dto.releaseStats?.totalSeasons ?? 1,
        isCompleted: dto.releaseStats?.isCompleted ?? false,
      },
      userStats: {
        score: dto.userStats?.score ?? 0,
        status: dto.userStats?.status ?? 'Planned',
      },
      imageUrl: dto.imageUrl ?? '',
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }
  },

  toDto(domain: Anime): AnimeDto {
    return {
      id: domain.id,
      title: domain.title,
      genres: domain.genres,
      origin: domain.origin,
      language: domain.language,
      releaseStats: {
        airingStarted: domain.releaseStats.airingStarted,
        airingEnded: domain.releaseStats.airingEnded,
        totalEpisodes: domain.releaseStats.totalEpisodes,
        totalSeasons: domain.releaseStats.totalSeasons,
        isCompleted: domain.releaseStats.isCompleted,
      },
      userStats: {
        score: domain.userStats.score,
        status: domain.userStats.status,
      },
      imageUrl: domain.imageUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  },
}
