import { MediaSchema } from '@common/media/media-schema.js';
import { z } from 'zod';

export const AnimeSchema = MediaSchema.extend({
  releaseStats: z
    .object({
      airingYear: z.string().regex(/^\d{4}$/, 'Must be a 4-digit year'),
      totalEpisodes: z.number().int().min(1).default(12),
      totalSeasons: z.number().int().min(1).default(1),
      isCompleted: z.boolean().default(false),
    })
    .optional(),
});

export type Anime = z.infer<typeof AnimeSchema>;
