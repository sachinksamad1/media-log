import type { MediaDTO } from '../../../common/media/media-dto.js';

import type { Fiction } from './fiction-schema.js';
export interface FictionDTO extends MediaDTO {
  author?: string;
  genres: string[];
  origin?: string;
  language?: string;
  format: 'E-Book' | 'Physical';
  type: 'Novel' | 'Short Story';
  publicationInfo: {
    published?: string;
    volumes: number;
    status: 'Completed' | 'Ongoing' | 'Hiatus';
  };
}

export type CreateFictionDto = Omit<Fiction, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFictionDto = Partial<CreateFictionDto>;
