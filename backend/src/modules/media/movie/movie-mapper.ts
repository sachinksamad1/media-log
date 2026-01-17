import { MediaMapper } from '@common/media/media-mapper.js';
import type { MovieDTO } from '@modules/media/movie/movie-dto.js';
import type { Movie } from '@modules/media/movie/movie-schema.js';

export class MovieMapper extends MediaMapper<Movie, MovieDTO> {
  protected mapSpecializedFields(entity: Movie): Partial<MovieDTO> {
    return {
      director: entity.director,
      cast: entity.cast ?? [],
      genres: entity.genres ?? [],
      origin: entity.origin,
      language: entity.language,
      movieStats: {
        releaseDate:
          entity.movieStats?.releaseDate instanceof Date
            ? entity.movieStats.releaseDate.toISOString()
            : undefined,
        runtimeMinutes: entity.movieStats?.runtimeMinutes,
        productionCompany: entity.movieStats?.productionCompany,
      },
    };
  }
}
