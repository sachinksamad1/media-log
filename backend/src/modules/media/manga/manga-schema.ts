import { z } from 'zod';

import { MediaSchema } from '../../../common/media/media-schema.js';

export const MangaSchema = MediaSchema.extend({
  author: z.string().optional(),
  illustrator: z.string().optional(),
  origin: z.string().default('Japan'),
  genres: z.array(z.string()).default([]),
  type: z
    .enum(['Manga', 'Manhwa', 'Manhua', 'One-shot', 'Doujinshi'])
    .default('Manga'),
  format: z.enum(['Physical', 'Digital', 'Magazine']).default('Digital'),
  releaseStats: z.object({
    chaptersPublished: z.number().int().min(1).default(1),
    volumesPublished: z.number().int().min(1).default(1),
    releaseStatus: z
      .enum(['Ongoing', 'Completed', 'Hiatus', 'Cancelled'])
      .default('Ongoing'),
  }),
  readingStats: z
    .object({
      currentReadingChapter: z.number().int().min(0),
      currentReadingVolume: z.number().int().min(0),
    })
    .default({
      currentReadingChapter: 0,
      currentReadingVolume: 0,
    }),
});

export type Manga = z.infer<typeof MangaSchema>;
