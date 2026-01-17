import { MediaRepository } from '@common/media/media-repository.js';
import type { SearchableRepository } from '@common/search/search-types.js';
import type { TvSeries } from '@modules/media/tv-series/tv-series-schema.js';

export class TvSeriesRepository
  extends MediaRepository<TvSeries>
  implements SearchableRepository<TvSeries & { id: string }>
{
  constructor() {
    super('tv_series');
  }

  getMediaType(): string {
    return 'tv_series';
  }
}
