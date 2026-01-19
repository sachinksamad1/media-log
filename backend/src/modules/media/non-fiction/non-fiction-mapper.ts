import { MediaMapper } from '@common/media/media-mapper.js';
import type { NonFictionDTO } from '@modules/media/non-fiction/non-fiction-dto.js';
import type { NonFiction } from '@modules/media/non-fiction/non-fiction-schema.js';

export class NonFictionMapper extends MediaMapper<NonFiction, NonFictionDTO> {
  protected mapSpecializedFields(entity: NonFiction): Partial<NonFictionDTO> {
    return {
      author: entity.author,
      format: entity.format,
      published:
        entity.published instanceof Date
          ? entity.published.toISOString()
          : entity.published,
      volumes: entity.volumes,
    };
  }
}
