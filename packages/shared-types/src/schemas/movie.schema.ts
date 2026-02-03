import { z } from 'zod';
import { MediaBaseSchema } from "./media-base.schema.js";

// =============================================================================
// MOVIE SCHEMA
// =============================================================================

export const MovieStatsSchema = z.object({
  releaseDate: z.coerce.date().optional(),
  runtimeMinutes: z.number().int().positive().optional(),
  productionCompany: z.string().optional(),
});

export const MovieSchema = MediaBaseSchema.extend({
  director: z.string().optional(),
  producer: z.string().optional(),
  studio: z.string().optional(),
  cast: z.array(z.string()).default([]),
  movieStats: MovieStatsSchema.default({}),
});

export type MovieStats = z.infer<typeof MovieStatsSchema>;
export type Movie = z.infer<typeof MovieSchema>;

// =============================================================================
// MOVIE DTO (for API responses)
// =============================================================================

export interface MovieDTO {
  id: string;
  title: string;
  genres: string[];
  origin?: string;
  language?: string;
  director?: string;
  producer?: string;
  studio?: string;
  cast: string[];
  movieStats: {
    releaseDate?: string;
    runtimeMinutes?: number;
    productionCompany?: string;
  };
  userStats: {
    score: number;
    status: string;
  };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
