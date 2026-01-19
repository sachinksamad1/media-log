import { MediaMapper } from '@common/media/media-mapper.js';
import type { LightNovelDTO } from '@modules/media/light-novel/light-novel-dto.js';
import type { LightNovel } from '@modules/media/light-novel/light-novel-schema.js';

export class LightNovelMapper extends MediaMapper<LightNovel, LightNovelDTO> {
  protected mapSpecializedFields(entity: LightNovel): Partial<LightNovelDTO> {
    return {
      author: entity.author,
      illustrator: entity.illustrator,
      type: entity.type,
      format: entity.format,
      releaseStatus: entity.releaseStats,
      readingStats: entity.readingStats,
    };
  }
}
