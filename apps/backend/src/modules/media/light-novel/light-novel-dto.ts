export type { LightNovelDTO } from '@media-log/shared-types';
import type { LightNovel } from '@modules/media/light-novel/light-novel-schema.js';

export type CreateLightNovelDto = Omit<
  LightNovel,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateLightNovelDto = Partial<CreateLightNovelDto>;
