import { MediaSchema } from '@common/media/media-schema.js';
import { z } from 'zod';

export const TvSeriesSchema = MediaSchema.extend({
  directors: z.array(z.string()).default([]),
  writers: z.array(z.string()).default([]),
  cast: z.array(z.string()).default([]),
  genre: z.array(z.string()).default([]),
  origin: z.string().default('International'),
  language: z.string().default('English'),
  tvSeriesStats: z
    .object({
      airingYear: z.string().regex(/^\d{4}$/, 'Must be a 4-digit year'),
      currentSeason: z.number().int().min(0).default(1),
      totalSeasons: z.number().int().min(1).default(1),
      totalEpisodes: z.number().int().optional(),
      isCompleted: z.boolean().default(false),
    })
    .optional(),
});

export type TvSeries = z.infer<typeof TvSeriesSchema>;
