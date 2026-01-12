import type { MediaDTO } from '../../../common/media/media-dto.js';

import type { Movie } from './movie-schema.js';

/**
 * Response DTO: Sent to the client
 */
export interface MovieDTO extends MediaDTO {
  director?: string;
  cast: string[];
  genres: string[];
  origin?: string;
  language?: string;
  movieStats: {
    releaseDate?: string;
    runtimeMinutes?: number;
    productionCompany?: string;
  };
}

/**
 * Request DTOs
 */
export type CreateMovieDto = Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMovieDto = Partial<CreateMovieDto>;
