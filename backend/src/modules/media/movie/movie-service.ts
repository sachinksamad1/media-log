import { MediaService } from '../../../common/media/media-service.js';

import { MovieRepository } from './movie-repo.js';
import type { Movie } from './movie-schema.js';

export class MovieService extends MediaService<Movie> {
  constructor() {
    super(new MovieRepository());
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
