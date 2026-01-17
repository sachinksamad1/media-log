import { MediaSchema } from '@common/media/media-schema.js';
import { z } from 'zod';

export const LightNovelSchema = MediaSchema.extend({
  author: z.string().optional(),
  illustrator: z.string().optional(),
  origin: z.string().default('Japan'),
  genres: z.array(z.string()).optional(),
  type: z.enum(['Series', 'Standalone']).optional().default('Series'),
  format: z
    .enum(['Web Novel', 'Light Novel', 'Physical', 'Digital'])
    .optional()
    .default('Light Novel'),
  releaseStats: z.object({
    releaseStatus: z
      .enum(['Ongoing', 'Completed', 'Hiatus', 'Cancelled'])
      .default('Ongoing'),
    volumes: z.number().int().min(1).default(1),
  }),
  readingStats: z
    .object({
      currentReadingVolume: z.number().int().min(0),
    })
    .default({
      currentReadingVolume: 0,
    }),
});

export type LightNovel = z.infer<typeof LightNovelSchema>;
