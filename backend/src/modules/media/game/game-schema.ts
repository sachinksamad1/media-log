import { MediaSchema } from '@common/media/media-schema.js';
import { z } from 'zod';

export const GameSchema = MediaSchema.extend({
  platforms: z.array(z.string()).default([]),
  developers: z.array(z.string()).optional(),
  publishers: z.array(z.string()).optional(),
  playthroughs: z
    .array(
      z.object({
        platformUsed: z.string(),
        isCompleted: z.boolean().default(false),
        achievementsUnlocked: z.number().optional(),
      }),
    )
    .default([]),
});

export type Games = z.infer<typeof GameSchema>;
