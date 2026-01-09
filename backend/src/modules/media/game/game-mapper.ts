import { MediaMapper } from "../../../common/media/media-mapper.js";
import { Games } from "./game-schema.js";
import { GameDTO } from "./game-dto.js";
import { formatTimestamp } from "../../../common/utils/date-utils.js";

export class GamesMapper extends MediaMapper<Games, GameDTO> {
  toDto(entity: Games): GameDTO {
    return {
      id: entity.id!,
      title: entity.title,
      category: entity.category,
      publicationInfo: entity.publicationInfo,
      playthroughs: entity.playthroughs,
      userStats: entity.userStats,
      createdAt: formatTimestamp(entity.createdAt),
      updatedAt: formatTimestamp(entity.updatedAt),
    };
  }
}
