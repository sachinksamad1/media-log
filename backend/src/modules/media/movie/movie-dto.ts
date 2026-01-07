import { Movie } from "./movie-schema.js";

export type CreateMovieDto = Omit<Movie, "id" | "createdAt" | "updatedAt">;

export type UpdateMovieDto = Partial<CreateMovieDto>;

export type MovieDTO = Omit<Movie, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

