export type { GameDTO } from '@media-log/shared-types';
import type { Game } from '@modules/media/game/game-schema.js';

export type CreateGameDto = Omit<Game, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGameDto = Partial<CreateGameDto>;
