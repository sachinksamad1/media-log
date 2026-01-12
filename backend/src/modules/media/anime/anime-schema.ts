// src/modules/media/anime/anime-schema.ts
import { z } from 'zod';

import { MediaSchema } from '../../../common/media/media-schema.js';

export const AnimeSchema = MediaSchema.extend({
  genre: z.array(z.string()).default([]),
  origin: z.string().default('Japan'),
  language: z.string().default('Japanese'),
  releaseStats: z
    .object({
      totalSeasons: z.number().int().min(1).default(1),
      isCompleted: z.boolean().default(false),
    })
    .optional(),
});

export type Anime = z.infer<typeof AnimeSchema>;
