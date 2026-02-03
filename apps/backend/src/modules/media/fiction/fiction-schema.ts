import { MediaSchema } from '@common/media/media-schema.js';
import { z } from 'zod';

export const FictionSchema = MediaSchema.extend({
  author: z.string().optional(),
  format: z.string().optional(),
  type: z.string().optional(),
  publicationInfo: z
    .object({
      published: z.date().optional().or(z.string().optional()),
      series: z.string().optional(),
      volumes: z.number().int().min(0).default(0),
      status: z.string().optional(),
    })
    .default({ volumes: 0, status: '' }),

  readingStats: z
    .object({
      currentReadingVolume: z.number().int().min(0),
    })
    .default({ currentReadingVolume: 1 }),
});

export type Fiction = z.infer<typeof FictionSchema>;
