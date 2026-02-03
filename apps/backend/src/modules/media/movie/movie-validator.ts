import { MovieSchema } from '@modules/media/movie/movie-schema.js';
import { z } from 'zod';

// 1. Validation for CREATE (POST)
export const createMovieValidator = z.object({
  body: MovieSchema.omit({
    id: true,
    uid: true,
    createdAt: true,
    updatedAt: true,
  }),
});

// 2. Validation for UPDATE (PATCH)
export const updateMovieValidator = z.object({
  params: z.object({
    id: z.string().min(1, 'ID parameter is required'),
  }),
  body: MovieSchema.omit({ uid: true }).partial(), // Makes all fields optional for partial updates
});

// 3. Validation for GET/DELETE by ID
export const movieIdValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

// 4. Validation for COMPLETE (PATCH)
export const completeMovieValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    score: z.number().min(0).max(10).optional(),
  }),
});
