import { MediaMapper } from '../../../common/media/media-mapper.js';

import type { LightNovelDTO } from './light-novel-dto.js';
import type { LightNovel } from './light-novel-schema.js';

export class LightNovelMapper extends MediaMapper<LightNovel, LightNovelDTO> {
  protected mapSpecializedFields(entity: LightNovel): Partial<LightNovelDTO> {
    return {
      author: entity.author,
      illustrator: entity.illustrator,
      origin: entity.origin,
      genres: entity.genres || [],
      type: entity.type,
      format: entity.format,
      releaseStatus: entity.releaseStats,
      readingStats: entity.readingStats,
    };
  }
}
