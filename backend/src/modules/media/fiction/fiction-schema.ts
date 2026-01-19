import { MediaSchema } from '@common/media/media-schema.js';
import { z } from 'zod';

export const FictionSchema = MediaSchema.extend({
  author: z.string().optional(),
  format: z.enum(['E-Book', 'Physical']).default('E-Book'),
  type: z.enum(['Novel', 'Short Story']).default('Novel'),

  publicationInfo: z
    .object({
      published: z.date().optional().or(z.string().regex(/\d{4}/)),
      volumes: z.number().int().min(1).default(1),
      status: z.enum(['Completed', 'Ongoing', 'Hiatus']).default('Completed'),
    })
    .default({ volumes: 1, status: 'Completed' }),
});

export type Fiction = z.infer<typeof FictionSchema>;
