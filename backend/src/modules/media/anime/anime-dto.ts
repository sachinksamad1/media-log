import type { MediaDTO } from '@common/media/media-dto.js';
import type { Anime } from '@modules/media/anime/anime-schema.js';

export interface AnimeDTO extends MediaDTO {
  genre: string[];
  origin: string;
  language: string;
  releaseStats?: {
    totalSeasons: number;
    isCompleted: boolean;
  };
}

export type CreateAnimeDto = Omit<Anime, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAnimeDto = Partial<CreateAnimeDto>;
