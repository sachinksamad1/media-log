import type { Game } from '../types/types'
import type { GameDto } from '../types/dtos'

export const GameMapper = {
  toDomain(dto: GameDto): Game {
    return {
      id: dto.id,
      title: dto.title,
      developers: dto.developers || [],
      publishers: dto.publishers || [],
      platforms: dto.platforms || [],
      genres: dto.genres || [],
      playthroughs: [],
      releaseDate: dto.releaseDate,
      userStats: {
        score: dto.userStats.score,
        status: dto.userStats.status,
        playTime: dto.userStats.playTime ?? 0,
      },
      language: dto.language,
      origin: dto.origin,
      imageUrl: dto.imageUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }
  },

  toDto(domain: Game): GameDto {
    return {
      id: domain.id,
      title: domain.title,
      developers: domain.developers,
      publishers: domain.publishers,
      platforms: domain.platforms,
      genres: domain.genres,
      releaseDate: domain.releaseDate,
      userStats: domain.userStats,
      language: domain.language,
      origin: domain.origin,
      imageUrl: domain.imageUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  },
}
