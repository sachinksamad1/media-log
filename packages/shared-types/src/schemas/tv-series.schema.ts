import { z } from 'zod';
import { MediaBaseSchema } from "./media-base.schema.js";

// =============================================================================
// TV SERIES SCHEMA
// =============================================================================

export const TvSeriesUserStatsSchema = z.object({
  score: z.number().min(0).max(10).default(0),
  status: z.enum(['Planned', 'Watching', 'Completed', 'Dropped', 'On-Hold']).default('Planned'),
  watchedEpisodes: z.number().int().min(0).default(0),
  rewatchCount: z.number().int().min(0).default(0),
});

export const TvSeriesStatsSchema = z.object({
  airingYear: z.string().regex(/^\d{4}$/, 'Must be a 4-digit year'),
  currentSeason: z.number().int().min(0).default(1),
  totalSeasons: z.number().int().min(1).default(1),
  totalEpisodes: z.number().int().optional(),
  isCompleted: z.boolean().default(false),
});

export const TvSeriesSchema = MediaBaseSchema.extend({
  directors: z.array(z.string()).default([]),
  writers: z.array(z.string()).default([]),
  cast: z.array(z.string()).default([]),
  network: z.string().optional(),
  studio: z.string().optional(),
  releaseDate: z.string().optional(),
  endDate: z.string().optional(),
  userStats: TvSeriesUserStatsSchema.default({
    score: 0,
    status: 'Planned',
    watchedEpisodes: 0,
    rewatchCount: 0,
  }),
  tvSeriesStats: TvSeriesStatsSchema.optional(),
});

export type TvSeriesUserStats = z.infer<typeof TvSeriesUserStatsSchema>;
export type TvSeriesStats = z.infer<typeof TvSeriesStatsSchema>;
export type TvSeries = z.infer<typeof TvSeriesSchema>;

// =============================================================================
// TV SERIES DTO (for API responses)
// =============================================================================

export interface TvSeriesDTO {
  id: string;
  title: string;
  genres: string[];
  origin?: string;
  language?: string;
  directors: string[];
  writers: string[];
  cast: string[];
  network?: string;
  studio?: string;
  releaseDate?: string;
  endDate?: string;
  userStats: {
    score: number;
    status: string;
    watchedEpisodes: number;
    rewatchCount: number;
  };
  tvSeriesStats?: {
    airingYear: string;
    currentSeason: number;
    totalSeasons: number;
    totalEpisodes?: number;
    isCompleted: boolean;
  };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
