import { z } from 'zod';
import { MediaBaseSchema } from "./media-base.schema.js";

// =============================================================================
// MANGA ENUMS
// =============================================================================

export const MangaTypeEnum = z.enum([
  'Manga',
  'Manhwa',
  'Manhua',
  'One-shot',
  'Doujinshi',
]);

export const MangaFormatEnum = z.enum(['Physical', 'Digital', 'Magazine']);

export const ReleaseStatusEnum = z.enum([
  'Ongoing',
  'Completed',
  'Hiatus',
  'Cancelled',
]);

// =============================================================================
// MANGA SCHEMA
// =============================================================================

export const MangaReleaseStatsSchema = z.object({
  chaptersPublished: z.number().int().min(1).default(1),
  volumesPublished: z.number().int().min(1).default(1),
  releaseStatus: ReleaseStatusEnum.default('Ongoing'),
});

export const MangaReadingStatsSchema = z.object({
  currentReadingChapter: z.number().int().min(0),
  currentReadingVolume: z.number().int().min(0),
});

export const MangaSchema = MediaBaseSchema.extend({
  author: z.string().optional(),
  illustrator: z.string().optional(),
  type: MangaTypeEnum.default('Manga'),
  format: MangaFormatEnum.default('Digital'),
  releaseStats: MangaReleaseStatsSchema,
  readingStats: MangaReadingStatsSchema.default({
    currentReadingChapter: 0,
    currentReadingVolume: 0,
  }),
});

export type MangaType = z.infer<typeof MangaTypeEnum>;
export type MangaFormat = z.infer<typeof MangaFormatEnum>;
export type ReleaseStatus = z.infer<typeof ReleaseStatusEnum>;
export type MangaReleaseStats = z.infer<typeof MangaReleaseStatsSchema>;
export type MangaReadingStats = z.infer<typeof MangaReadingStatsSchema>;
export type Manga = z.infer<typeof MangaSchema>;

// =============================================================================
// MANGA DTO (for API responses)
// =============================================================================

export interface MangaDTO {
  id: string;
  title: string;
  author?: string;
  illustrator?: string;
  origin?: string;
  genres: string[];
  type: string;
  format: string;
  releaseStats: {
    chaptersPublished: number;
    volumesPublished: number;
    releaseStatus: string;
  };
  readingStats?: {
    currentReadingChapter: number;
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
