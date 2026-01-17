import { MediaRepository } from '@common/media/media-repository.js';
import type { SearchableRepository } from '@common/search/search-types.js';

import type { Manga } from './manga-schema.js';

export class MangaRepository
  extends MediaRepository<Manga>
  implements SearchableRepository<Manga & { id: string }>
{
  constructor() {
    super('manga');
  }

  getMediaType(): string {
    return 'manga';
  }
}
