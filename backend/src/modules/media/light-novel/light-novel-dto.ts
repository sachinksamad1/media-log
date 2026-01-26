import type { MediaDTO } from '@common/media/media-dto.js';
import type { LightNovel } from '@modules/media/light-novel/light-novel-schema.js';

export interface LightNovelDTO extends MediaDTO {
  author: string;
  illustrator: string;
  type: string;
  format: string;
  releaseStats: {
    releaseStatus: string;
    volumesPublished: number;
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
