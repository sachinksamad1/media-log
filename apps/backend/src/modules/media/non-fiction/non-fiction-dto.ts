export type { NonFictionDTO } from '@media-log/shared-types';
import type { NonFiction } from '@modules/media/non-fiction/non-fiction-schema.js';

export type CreateNonFictionDto = Omit<
  NonFiction,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateNonFictionDto = Partial<CreateNonFictionDto>;
