import type { MediaDTO } from '@common/media/media-dto.js';
import type { Games } from '@modules/media/game/game-schema.js';

export interface GameDTO extends MediaDTO {
  genres: string[];
  platforms: ('PC' | 'Xbox' | 'PlayStation' | 'Switch' | 'Mobile' | 'Other')[];
  developers: string[];
  publishers: string[];
  playthroughs: {
    platformUsed: string;
    isCompleted: boolean;
    achievementsUnlocked?: number;
  }[];
}

export type CreateGameDto = Omit<Games, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGameDto = Partial<CreateGameDto>;
