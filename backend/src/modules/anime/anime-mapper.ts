import { BaseMapper } from "../../common/base/base-mapper.js";
import { Anime } from "./anime-schema.js";
import { AnimeResponseDto } from "./anime-dto.js";

export class AnimeMapper extends BaseMapper<Anime, AnimeResponseDto> {
  toDto(entity: Anime): AnimeResponseDto {
    return {
      id: entity.id!,
      title: entity.title,
      genre: entity.genre,
      origin: entity.origin,
      language: entity.language,
      animeStats: entity.animeStats,
      userStats: entity.userStats,
      imageUrl: entity.imageUrl,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
