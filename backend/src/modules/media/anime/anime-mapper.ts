import { MediaMapper } from '@common/media/media-mapper.js';
import type { AnimeDTO } from '@modules/media/anime/anime-dto.js';
import type { Anime } from '@modules/media/anime/anime-schema.js';

export class AnimeMapper extends MediaMapper<Anime, AnimeDTO> {
  protected mapSpecializedFields(entity: Anime): Partial<AnimeDTO> {
    return {
      genre: entity.genre || [],
      origin: entity.origin || 'Japan',
      language: entity.language || 'Japanese',
      releaseStats: entity.releaseStats,
    };
  }
}
