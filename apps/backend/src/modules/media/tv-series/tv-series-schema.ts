import { MediaSchema } from '@common/media/media-schema.js';
import { z } from 'zod';

export const TvSeriesSchema = MediaSchema.extend({
  directors: z.array(z.string()).default([]),
  writers: z.array(z.string()).default([]),
  cast: z.array(z.string()).default([]),
  network: z.string().optional(),
  studio: z.string().optional(),
  releaseDate: z.string().optional(),
  endDate: z.string().optional(),
  userStats: z
    .object({
      score: z.number().min(0).max(10).default(0),
      status: z
        .enum(['Planned', 'Watching', 'Completed', 'Dropped', 'On-Hold'])
        .default('Planned'),
      watchedEpisodes: z.number().int().min(0).default(0),
      rewatchCount: z.number().int().min(0).default(0),
    })
    .default({
      score: 0,
      status: 'Planned',
      watchedEpisodes: 0,
      rewatchCount: 0,
    }),
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
