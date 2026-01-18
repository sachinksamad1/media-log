import type { Anime } from '../types/types';
import type { AnimeDto } from '../types/dtos';

export const AnimeMapper = {
  toDomain(dto: AnimeDto): Anime {
    return {
      id: dto.id,
      title: dto.title,
      genre: dto.genre,
      origin: dto.origin,
      language: dto.language,
      releaseStats: {
        isCompleted: dto.releaseStats.isCompleted,
        totalSeasons: dto.releaseStats.totalSeasons,
      },
      userStats: {
        score: dto.userStats.score,
        status: dto.userStats.status,
      },
      imageUrl: dto.imageUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  },

  toDto(domain: Anime): AnimeDto {
    return {
      id: domain.id,
      title: domain.title,
      genre: domain.genre,
      origin: domain.origin,
      language: domain.language,
      releaseStats: {
        isCompleted: domain.releaseStats.isCompleted,
        totalSeasons: domain.releaseStats.totalSeasons,
      },
      userStats: {
        score: domain.userStats.score,
        status: domain.userStats.status,
      },
      imageUrl: domain.imageUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
};
