import { BaseMapper } from "../../../common/base/base-mapper.js";
import { LightNovel } from "./light-novel-schema.js";
import { LightNovelDTO } from "./light-novel-dto.js";
import { formatTimestamp } from "../../../common/utils/date-utils.js";

export class LightNovelMapper extends BaseMapper<LightNovel, LightNovelDTO> {
  toDto(entity: LightNovel): LightNovelDTO {
    return {
      id: entity.id!,
      title: entity.title,
      author: entity.author,
      illustrator: entity.illustrator,
      origin: entity.origin,
      genres: entity.genres,
      type: entity.type,
      format: entity.format,
      releaseStats: entity.releaseStats,
      userStats: entity.userStats,
      imageUrl: entity.imageUrl,
      createdAt: formatTimestamp(entity.createdAt),
      updatedAt: formatTimestamp(entity.updatedAt),
    };
  }
}
