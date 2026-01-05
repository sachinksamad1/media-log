import { BaseMapper } from "../../common/base/base-mapper.js";
import { Fiction } from "./fiction-schema.js";
import { FictionResponseDto } from "./fiction-dto.js";

export class FictionMapper extends BaseMapper<Fiction, FictionResponseDto> {
  toDto(entity: Fiction): FictionResponseDto {
    return {
      id: entity.id!,
      title: entity.title,
      author: entity.author,
      published: entity.published,
      genres: entity.genres,
      origin: entity.origin,
      language: entity.language,
      format: entity.format,
      type: entity.type,
      volumes: entity.volumes,
      publicationStatus: entity.publicationStatus,
      readingStatus: entity.readingStatus,
      score: entity.score,
      imageUrl: entity.imageUrl,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
