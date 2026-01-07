import { BaseMapper } from "../../../common/base/base-mapper.js";
import { NonFiction } from "./non-fiction-schema.js";
import { NonFictionDTO } from "./non-fiction-dto.js";
import { formatTimestamp } from "../../../common/utils/date-utils.js";

export class NonFictionMapper extends BaseMapper<NonFiction, NonFictionDTO> {
  toDto(entity: NonFiction): NonFictionDTO {
    return {
      id: entity.id!,
      title: entity.title,
      genres: entity.genres,
      author: entity.author,
      format: entity.format,
      volumes: entity.volumes,
      published: entity.published,
      userStats: entity.userStats,
      imageUrl: entity.imageUrl,
      createdAt: formatTimestamp(entity.createdAt),
      updatedAt: formatTimestamp(entity.updatedAt),
    };
  }
}
