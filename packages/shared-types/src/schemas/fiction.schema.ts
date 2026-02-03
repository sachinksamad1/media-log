import { z } from 'zod';
import { MediaBaseSchema } from "./media-base.schema.js";

// =============================================================================
// FICTION SCHEMA
// =============================================================================

export const FictionPublicationInfoSchema = z.object({
  published: z.date().optional().or(z.string().optional()),
  series: z.string().optional(),
  volumes: z.number().int().min(0).default(0),
  status: z.string().optional(),
});

export const FictionReadingStatsSchema = z.object({
  currentReadingVolume: z.number().int().min(0),
});

export const FictionSchema = MediaBaseSchema.extend({
  author: z.string().optional(),
  format: z.string().optional(),
  type: z.string().optional(),
  publicationInfo: FictionPublicationInfoSchema.default({
    volumes: 0,
    status: '',
  }),
  readingStats: FictionReadingStatsSchema.default({
    currentReadingVolume: 1,
  }),
});

export type FictionPublicationInfo = z.infer<typeof FictionPublicationInfoSchema>;
export type FictionReadingStats = z.infer<typeof FictionReadingStatsSchema>;
export type Fiction = z.infer<typeof FictionSchema>;

// =============================================================================
// FICTION DTO (for API responses)
// =============================================================================

export interface FictionDTO {
  id: string;
  title: string;
  genres: string[];
  origin?: string;
  language?: string;
  author?: string;
  format?: string;
  type?: string;
  publicationInfo: {
    published?: string;
    series?: string;
    volumes: number;
    status?: string;
  };
  readingStats: {
    currentReadingVolume: number;
  };
  userStats: {
    score: number;
    status: string;
  };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
