import { MediaService } from '../../../common/media/media-service.js';

import { TvSeriesRepository } from './tv-series-repo.js';
import type { TvSeries } from './tv-series-schema.js';

export class TvSeriesService extends MediaService<TvSeries> {
  constructor() {
    super(new TvSeriesRepository());
  }

  // Mark as completed
  complete(id: string, score: number = 7) {
    return this.update(id, {
      userStats: {
        score,
        status: 'Completed',
      },
    });
  }
}
