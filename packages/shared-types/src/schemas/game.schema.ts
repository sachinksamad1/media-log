import { z } from 'zod';
import { MediaBaseSchema, UserStatusEnum } from "./media-base.schema.js";

// =============================================================================
// GAME SCHEMA
// =============================================================================

export const PlaythroughSchema = z.object({
  platformUsed: z.string(),
  isCompleted: z.boolean().default(false),
  achievementsUnlocked: z.number().optional(),
});

export const GameUserStatsSchema = z.object({
  score: z.number().min(0).max(10).default(0),
  status: UserStatusEnum.default('Planned'),
  playTime: z.number().min(0).default(0),
});

export const GameSchema = MediaBaseSchema.extend({
  platforms: z.array(z.string()).default([]),
  developers: z.array(z.string()).default([]),
  publishers: z.array(z.string()).default([]),
  releaseDate: z.string().optional(),
  userStats: GameUserStatsSchema.default({
    score: 0,
    status: 'Planned',
    playTime: 0,
  }),
  playthroughs: z.array(PlaythroughSchema).default([]),
});

export type Playthrough = z.infer<typeof PlaythroughSchema>;
export type GameUserStats = z.infer<typeof GameUserStatsSchema>;
export type Game = z.infer<typeof GameSchema>;

// =============================================================================
// GAME DTO (for API responses)
// =============================================================================

export interface GameDTO {
  id: string;
  title: string;
  genres: string[];
  origin?: string;
  language?: string;
  platforms: string[];
  developers: string[];
  publishers: string[];
  releaseDate?: string;
  userStats: {
    score: number;
    status: string;
    playTime: number;
  };
  playthroughs: Array<{
    platformUsed: string;
    isCompleted: boolean;
    achievementsUnlocked?: number;
  }>;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
