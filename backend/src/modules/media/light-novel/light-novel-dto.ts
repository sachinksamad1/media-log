import type { MediaDTO } from '../../../common/media/media-dto.js';

import type { LightNovel } from './light-novel-schema.js';

export interface LightNovelDTO extends MediaDTO {
  author: string;
  illustrator: string;
  origin: string;
  genres: string[];
  type: string;
  format: string;
  releaseStatus: {
    releaseStatus: string;
    volumes: number;
  };
  readingStats: {
    currentReadingVolume: number;
  };
}

export type CreateLightNovelDto = Omit<
  LightNovel,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateLightNovelDto = Partial<CreateLightNovelDto>;
