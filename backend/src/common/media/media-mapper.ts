import type { MediaSchema } from '@common/media/media-schema.js';
import { formatTimestamp } from '@common/utils/date-utils.js';
import type { z } from 'zod';

export abstract class MediaMapper<T extends z.infer<typeof MediaSchema>, DTO> {
  /**
   * Transforms a database record (Entity) into a clean DTO.
   * Handles common conversions like Firestore Timestamps to ISO strings.
   */
  toDto(entity: T): DTO {
    return {
      id: entity.id,
      title: entity.title,
      imageUrl: entity.imageUrl || '',
      origin: entity.origin,
      genres: entity.genres || [],
      language: entity.language,
      userStats: entity.userStats,
      // Convert Dates to ISO strings for frontend consistency
      createdAt: formatTimestamp(entity.createdAt),
      updatedAt: formatTimestamp(entity.updatedAt),
      ...this.mapSpecializedFields(entity),
    } as DTO;
  }

  /**
   * Transforms an array of entities into an array of DTOs.
   */
  toDtoList(entities: T[]): DTO[] {
    return entities.map((entity) => this.toDto(entity));
  }

  protected abstract mapSpecializedFields(entity: T): Partial<DTO>;
}
