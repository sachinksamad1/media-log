export type { AnimeDTO } from '@media-log/shared-types';
import type { Anime } from '@modules/media/anime/anime-schema.js';

export type CreateAnimeDto = Omit<Anime, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAnimeDto = Partial<CreateAnimeDto>;
