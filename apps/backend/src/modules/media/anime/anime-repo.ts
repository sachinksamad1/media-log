import { MediaRepository } from '@common/media/media-repository.js';
import type { SearchableRepository } from '@common/search/search-types.js';
import type { Anime } from '@modules/media/anime/anime-schema.js';

export class AnimeRepository
  extends MediaRepository<Anime>
  implements SearchableRepository<Anime & { id: string }>
{
  constructor() {
    super('anime');
  }

  getMediaType(): string {
    return 'anime';
  }
}
