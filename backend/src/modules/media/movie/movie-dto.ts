import type { MediaDTO } from '@common/media/media-dto.js';
import type { Movie } from '@modules/media/movie/movie-schema.js';

/**
 * Response DTO: Sent to the client
 */
export interface MovieDTO extends MediaDTO {
  director?: string;
  cast: string[];
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
