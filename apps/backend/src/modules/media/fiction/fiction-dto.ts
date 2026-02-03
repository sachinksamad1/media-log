import type { MediaDTO } from '@common/media/media-dto.js';
import type { Fiction } from '@modules/media/fiction/fiction-schema.js';

export interface FictionDTO extends MediaDTO {
  author?: string;
  format: string; // 'Physical' or 'Digital'
  type: string; // 'Series' or 'Standalone'
  publicationInfo: {
    published?: string;
    series?: string;
    volumes: number;
    status: string;
  };
  readingStats: {
    currentReadingVolume: number;
  };
}

export type CreateFictionDto = Omit<Fiction, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFictionDto = Partial<CreateFictionDto>;
