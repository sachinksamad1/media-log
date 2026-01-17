import { MediaMapper } from '@common/media/media-mapper.js';

import type { MangaDTO } from '@/modules/media/manga/manga-dto.js';
import type { Manga } from '@/modules/media/manga/manga-schema.js';

export class MangaMapper extends MediaMapper<Manga, MangaDTO> {
  protected mapSpecializedFields(entity: Manga): Partial<MangaDTO> {
    return {
      author: entity.author,
      illustrator: entity.illustrator,
      origin: entity.origin,
      genres: entity.genres || [],
      type: entity.type,
      format: entity.format,
      releaseStats: entity.releaseStats,
      readingStats: entity.readingStats,
    };
  }
}
