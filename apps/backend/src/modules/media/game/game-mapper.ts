import { MediaMapper } from '@common/media/media-mapper.js';
import type { GameDTO } from '@modules/media/game/game-dto.js';
import type { Game } from '@modules/media/game/game-schema.js';

export class GameMapper extends MediaMapper<Game, GameDTO> {
  protected mapSpecializedFields(entity: Game): Partial<GameDTO> {
    return {
      platforms: entity.platforms,
      developers: entity.developers,
      publishers: entity.publishers,
      releaseDate: entity.releaseDate,
      playthroughs: entity.playthroughs.map((p) => ({
        ...p,
        achievementsUnlocked: p.achievementsUnlocked ?? 0,
      })),
    };
  }
}
