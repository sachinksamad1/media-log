import type { MediaDTO } from '../../../common/media/media-dto.js';

import type { Manga } from './manga-schema.js';

export interface MangaDTO extends MediaDTO {
  author: string;
  illustrator: string;
  origin: string;
  genres: string[];
  type: string;
  format: string;
  releaseStats: {
    chaptersPublished: number;
    volumesPublished: number;
    releaseStatus: string;
  };
  readingStats: {
    currentReadingVolume: number;
    currentReadingChapter: number;
  };
}

export type CreateMangaDto = Omit<Manga, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMangaDto = Partial<CreateMangaDto>;
