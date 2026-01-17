import { MediaRepository } from '@common/media/media-repository.js';
import type { SearchableRepository } from '@common/search/search-types.js';
import type { Movie } from '@modules/media/movie/movie-schema.js';

export class MovieRepository
  extends MediaRepository<Movie>
  implements SearchableRepository<Movie & { id: string }>
{
  constructor() {
    super('movie');
  }

  getMediaType(): string {
    return 'movie';
  }
}
