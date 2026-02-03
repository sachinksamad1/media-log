import type { MediaDTO } from '@common/media/media-dto.js';
import type { Games } from '@modules/media/game/game-schema.js';

export interface GameDTO extends MediaDTO {
  platforms: string[];
  developers: string[];
  publishers: string[];
  releaseDate?: string;
  userStats: {
    score: number;
    status: string;
    playTime: number;
  };
  playthroughs: {
    platformUsed: string;
    isCompleted: boolean;
    achievementsUnlocked?: number;
  }[];
}

export type CreateGameDto = Omit<Games, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGameDto = Partial<CreateGameDto>;
