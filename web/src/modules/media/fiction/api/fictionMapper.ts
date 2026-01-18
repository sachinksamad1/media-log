import type { Fiction } from '../types/types';
import type { FictionDto } from '../types/dtos';

export const FictionMapper = {
  toDomain(dto: FictionDto): Fiction {
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
      readingStats: dto.readingStats,
      imageUrl: dto.imageUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  },

  toDto(domain: Fiction): FictionDto {
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
      readingStats: domain.readingStats,
      imageUrl: domain.imageUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
};
