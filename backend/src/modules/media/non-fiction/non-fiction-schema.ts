import { MediaSchema } from '@common/media/media-schema.js';
import { z } from 'zod';

export const NonFictionSchema = MediaSchema.extend({
  author: z.string().optional(),
  format: z.enum(['E-Book', 'Physical']).default('E-Book'),
  published: z.date().optional().or(z.string().regex(/\d{4}/)),
  volumes: z
    .array(
      z.object({
        standalone: z.boolean().default(true),
        seriesName: z.string().optional(),
        order: z.number().int().min(1).default(1),
        total: z.number().int().min(1).default(1),
        isCompleted: z.boolean().default(true),
      }),
    )
    .default([]),
});

export type NonFiction = z.infer<typeof NonFictionSchema>;
