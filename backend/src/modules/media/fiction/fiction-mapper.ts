import { formatTimestamp } from "../../../common/utils/date-utils.js";
import { BaseMapper } from "../../../common/base/base-mapper.js";
import { Fiction } from "./fiction-schema.js";
import { FictionDTO } from "./fiction-dto.js";

export class FictionMapper extends BaseMapper<Fiction, FictionDTO> {
  toDto(entity: Fiction): FictionDTO {
    return {
      id: entity.id!,
      title: entity.title,
      author: entity.author,
      genres: entity.genres,
      origin: entity.origin,
      language: entity.language,
      format: entity.format,
      type: entity.type,
      publicationInfo: entity.publicationInfo,
      userStats: entity.userStats,
      imageUrl: entity.imageUrl,
      createdAt: formatTimestamp(entity.createdAt),
      updatedAt: formatTimestamp(entity.updatedAt),
    };
  }
}
