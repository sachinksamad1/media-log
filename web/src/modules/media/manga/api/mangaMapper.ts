import type { Manga } from '../types/types';
import type { MangaDto } from '../types/dtos';

export const MangaMapper = {
  toDomain(dto: MangaDto): Manga {
    return {
      id: dto.id,
      title: dto.title,
      author: dto.author,
      illustrator: dto.illustrator,
      origin: dto.origin,
      genres: dto.genres,
      type: dto.type,
      format: dto.format,
      releaseStats: dto.releaseStats,
      userStats: dto.userStats,
      imageUrl: dto.imageUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  },

  toDto(domain: Manga): MangaDto {
    return {
      id: domain.id,
      title: domain.title,
      author: domain.author,
      illustrator: domain.illustrator,
      origin: domain.origin,
      genres: domain.genres,
      type: domain.type,
      format: domain.format,
      releaseStats: domain.releaseStats,
      userStats: domain.userStats,
      imageUrl: domain.imageUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
};
