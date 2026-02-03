import { z } from 'zod';
import { MediaBaseSchema } from './media-base.schema';

// =============================================================================
// ANIME SCHEMA
// =============================================================================

export const AnimeReleaseStatsSchema = z.object({
  airingStarted: z
    .string()
    .regex(/^\d{4}$/, 'Must be a 4-digit year')
    .or(z.literal(''))
    .nullish(),
  airingEnded: z
    .string()
    .regex(/^\d{4}$/, 'Must be a 4-digit year')
    .or(z.literal(''))
    .nullish(),
  totalEpisodes: z.number().int().min(0).default(12),
  totalSeasons: z.number().int().min(0).default(1),
  isCompleted: z.boolean().default(false),
});

export const AnimeSchema = MediaBaseSchema.extend({
  releaseStats: AnimeReleaseStatsSchema.optional(),
});

export type AnimeReleaseStats = z.infer<typeof AnimeReleaseStatsSchema>;
export type Anime = z.infer<typeof AnimeSchema>;

// =============================================================================
// ANIME DTO (for API responses)
// =============================================================================

export interface AnimeDTO {
  id: string;
  title: string;
  genres: string[];
  origin?: string;
  language?: string;
  releaseStats: {
    airingStarted: string;
    airingEnded: string;
    totalEpisodes: number;
    totalSeasons: number;
    isCompleted: boolean;
  };
  userStats: {
    score: number;
    status: string;
  };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
