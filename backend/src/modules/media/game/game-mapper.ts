import { MediaMapper } from '@common/media/media-mapper.js';
import type { GameDTO } from '@modules/media/game/game-dto.js';
import type { Games } from '@modules/media/game/game-schema.js';

export class GameMapper extends MediaMapper<Games, GameDTO> {
  protected mapSpecializedFields(entity: Games): Partial<GameDTO> {
    return {
      genres: entity.genres,
      platforms: entity.platforms,
      developers: entity.developers,
      publishers: entity.publishers,
      playthroughs: entity.playthroughs.map((p) => ({
        ...p,
        achievementsUnlocked: p.achievementsUnlocked ?? 0,
      })),
    };
  }
}
