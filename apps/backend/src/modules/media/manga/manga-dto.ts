export type { MangaDTO } from '@media-log/shared-types';
import type { Manga } from '@modules/media/manga/manga-schema.js';

export type CreateMangaDto = Omit<Manga, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMangaDto = Partial<CreateMangaDto>;
