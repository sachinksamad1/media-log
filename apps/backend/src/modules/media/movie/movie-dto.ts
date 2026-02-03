export type { MovieDTO } from '@media-log/shared-types';
import type { Movie } from '@modules/media/movie/movie-schema.js';

export type CreateMovieDto = Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMovieDto = Partial<CreateMovieDto>;
