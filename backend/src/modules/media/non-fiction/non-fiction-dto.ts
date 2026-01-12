import type { MediaDTO } from '../../../common/media/media-dto.js';

import type { NonFiction } from './non-fiction-schema.js';

export interface NonFictionDTO extends MediaDTO {
  author?: string;
  genres: string[];
  origin?: string;
  language: string;
  format: 'E-Book' | 'Physical';
  published?: string;
  volumes: {
    standalone: boolean;
    seriesName?: string;
    order: number;
    total: number;
    isCompleted: boolean;
  }[];
}

export type CreateNonFictionDto = Omit<
  NonFiction,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateNonFictionDto = Partial<CreateNonFictionDto>;
