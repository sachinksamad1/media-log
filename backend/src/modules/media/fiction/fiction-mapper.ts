import { MediaMapper } from '@common/media/media-mapper.js';
import type { FictionDTO } from '@modules/media/fiction/fiction-dto.js';
import type { Fiction } from '@modules/media/fiction/fiction-schema.js';

export class FictionMapper extends MediaMapper<Fiction, FictionDTO> {
  protected mapSpecializedFields(entity: Fiction): Partial<FictionDTO> {
    return {
      author: entity.author,
      format: entity.format,
      type: entity.type,
      publicationInfo: {
        published: this.formatPublishedDate(entity.publicationInfo?.published),
        series: entity.publicationInfo?.series,
        volumes: entity.publicationInfo?.volumes ?? 1,
        status: entity.publicationInfo?.status ?? 'Completed',
      },
      readingStats: {
        currentReadingVolume: entity.readingStats?.currentReadingVolume ?? 1,
      },
    };
  }

  private formatPublishedDate(
    date: Date | string | undefined,
  ): string | undefined {
    if (!date) return undefined;
    return date instanceof Date ? date.toISOString() : date;
  }
}
