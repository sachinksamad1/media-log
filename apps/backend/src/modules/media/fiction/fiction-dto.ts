export type { FictionDTO } from '@media-log/shared-types';
import type { Fiction } from '@modules/media/fiction/fiction-schema.js';

export type CreateFictionDto = Omit<Fiction, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFictionDto = Partial<CreateFictionDto>;
