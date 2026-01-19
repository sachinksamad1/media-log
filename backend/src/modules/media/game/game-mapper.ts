import { MediaMapper } from '@common/media/media-mapper.js';
import type { GameDTO } from '@modules/media/game/game-dto.js';
import type { Games } from '@modules/media/game/game-schema.js';

export class GameMapper extends MediaMapper<Games, GameDTO> {
  protected mapSpecializedFields(entity: Games): Partial<GameDTO> {
    return {
      platforms: entity.platforms as GameDTO['platforms'],
      developers: entity.developers as GameDTO['developers'],
      publishers: entity.publishers as GameDTO['publishers'],
      playthroughs: entity.playthroughs.map((p) => ({
        ...p,
        achievementsUnlocked: p.achievementsUnlocked ?? 0,
      })),
    };
  }
}
