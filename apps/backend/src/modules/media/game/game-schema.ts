import { MediaSchema, UserStatusEnum } from '@common/media/media-schema.js';
import { z } from 'zod';

export const GameSchema = MediaSchema.extend({
  platforms: z.array(z.string()).default([]),
  developers: z.array(z.string()).default([]),
  publishers: z.array(z.string()).default([]),
  releaseDate: z.string().optional(),
  userStats: z
    .object({
      score: z.number().min(0).max(10).default(0),
      status: UserStatusEnum.default('Planned'),
      playTime: z.number().min(0).default(0),
    })
    .default({
      score: 0,
      status: 'Planned',
      playTime: 0,
    }),
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
