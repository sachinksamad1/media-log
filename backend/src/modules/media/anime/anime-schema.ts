import { MediaSchema } from '@common/media/media-schema.js';
import { z } from 'zod';

export const AnimeSchema = MediaSchema.extend({
  releaseStats: z
    .object({
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
    })
    .optional(),
});

export type Anime = z.infer<typeof AnimeSchema>;
