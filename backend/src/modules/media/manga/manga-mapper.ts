import { MediaMapper } from "../../../common/media/media-mapper.js";
import { Manga } from "./manga-schema.js";
import { MangaDTO } from "./manga-dto.js";
import { formatTimestamp } from "../../../common/utils/date-utils.js";

export class MangaMapper extends MediaMapper<Manga, MangaDTO> {
  toDto(entity: Manga): MangaDTO {
    return {
      id: entity.id!,
      title: entity.title,
      author: entity.author,
      illustrator: entity.illustrator,
      origin: entity.origin,
      genres: entity.genres,
      type: entity.type,
      format: entity.format,
      readingStats: entity.readingStats,
      releaseStats: entity.releaseStats,
      userStats: entity.userStats,
      imageUrl: entity.imageUrl,
      createdAt: formatTimestamp(entity.createdAt),
      updatedAt: formatTimestamp(entity.updatedAt),
    };
  }
}
