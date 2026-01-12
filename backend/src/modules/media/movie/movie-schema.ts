import { z } from 'zod';

import { MediaSchema } from '../../../common/media/media-schema.js';

export const MovieSchema = MediaSchema.extend({
  director: z.string().optional(),
  cast: z.array(z.string()).default([]),
  genres: z.array(z.string()).default([]),
  origin: z.string().optional(),
  language: z.string().optional(),
  movieStats: z
    .object({
      releaseDate: z.coerce.date().optional(),
      runtimeMinutes: z.number().int().positive().optional(),
      productionCompany: z.string().optional(),
    })
    .default({}),
});

export type Movie = z.infer<typeof MovieSchema>;
