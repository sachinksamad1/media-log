import { formatTimestamp } from "../../../common/utils/date-utils.js";
import { BaseMapper } from "../../../common/base/base-mapper.js";
import { Anime } from "./anime-schema.js";
import { AnimeDTO } from "./anime-dto.js";

export class AnimeMapper extends BaseMapper<Anime, AnimeDTO> {
  toDto(entity: Anime): AnimeDTO {
    return {
      id: entity.id!,
      title: entity.title,
      genre: entity.genre,
      origin: entity.origin,
      language: entity.language,
      releaseStats: entity.releaseStats,
      userStats: entity.userStats,
      imageUrl: entity.imageUrl,
      createdAt: formatTimestamp(entity.createdAt),
      updatedAt: formatTimestamp(entity.updatedAt),
    };
  }
}
