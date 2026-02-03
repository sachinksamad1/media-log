import { z } from "zod";
import { MediaBaseSchema } from "./media-base.schema.js";
import { ReleaseStatusEnum } from "./manga.schema.js";

// =============================================================================
// LIGHT NOVEL ENUMS
// =============================================================================

export const LightNovelTypeEnum = z.enum(["Series", "Standalone"]);
export const LightNovelFormatEnum = z.enum([
  "Web Novel",
  "Light Novel",
  "Physical",
  "Digital",
]);

// =============================================================================
// LIGHT NOVEL SCHEMA
// =============================================================================

export const LightNovelReleaseStatsSchema = z.object({
  releaseStatus: ReleaseStatusEnum.default("Ongoing"),
  volumesPublished: z.number().int().min(0).default(0),
});

export const LightNovelReadingStatsSchema = z.object({
  currentReadingVolume: z.number().int().min(0),
});

export const LightNovelSchema = MediaBaseSchema.extend({
  author: z.string().optional(),
  illustrator: z.string().optional(),
  type: LightNovelTypeEnum.optional().default("Series"),
  format: LightNovelFormatEnum.optional().default("Light Novel"),
  releaseStats: LightNovelReleaseStatsSchema,
  readingStats: LightNovelReadingStatsSchema.default({
    currentReadingVolume: 0,
  }),
});

export type LightNovelType = z.infer<typeof LightNovelTypeEnum>;
export type LightNovelFormat = z.infer<typeof LightNovelFormatEnum>;
export type LightNovelReleaseStats = z.infer<
  typeof LightNovelReleaseStatsSchema
>;
export type LightNovelReadingStats = z.infer<
  typeof LightNovelReadingStatsSchema
>;
export type LightNovel = z.infer<typeof LightNovelSchema>;

// =============================================================================
// LIGHT NOVEL DTO (for API responses)
// =============================================================================

export interface LightNovelDTO {
  id: string;
  title: string;
  genres: string[];
  origin?: string;
  language?: string;
  author?: string;
  illustrator?: string;
  type: string;
  format: string;
  releaseStats: {
    releaseStatus: string;
    volumesPublished: number;
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
