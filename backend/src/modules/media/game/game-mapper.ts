import { MediaMapper } from '../../../common/media/media-mapper.js';

import type { GameDTO } from './game-dto.js';
import type { Games } from './game-schema.js';

export class GamesMapper extends MediaMapper<Games, GameDTO> {
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
