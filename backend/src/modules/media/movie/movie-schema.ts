import { MediaSchema } from '@common/media/media-schema.js';
import { z } from 'zod';

export const MovieSchema = MediaSchema.extend({
  director: z.string().optional(),
  cast: z.array(z.string()).default([]),
  movieStats: z
    .object({
      releaseDate: z.coerce.date().optional(),
      runtimeMinutes: z.number().int().positive().optional(),
      productionCompany: z.string().optional(),
    })
    .default({}),
});

export type Movie = z.infer<typeof MovieSchema>;
