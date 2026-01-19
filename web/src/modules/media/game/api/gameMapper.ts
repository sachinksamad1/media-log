import type { Game } from '../types/types'
import type { GameDto } from '../types/dtos'

export const GameMapper = {
  toDomain(dto: GameDto): Game {
    return {
      id: dto.id,
      title: dto.title,
      developer: dto.developer,
      publisher: dto.publisher,
      platforms: dto.platforms,
      genres: dto.genres,
      releaseDate: dto.releaseDate,
      userStats: dto.userStats,
      imageUrl: dto.imageUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }
  },

  toDto(domain: Game): GameDto {
    return {
      id: domain.id,
      title: domain.title,
      developer: domain.developer,
      publisher: domain.publisher,
      platforms: domain.platforms,
      genres: domain.genres,
      releaseDate: domain.releaseDate,
      userStats: domain.userStats,
      imageUrl: domain.imageUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  },
}
