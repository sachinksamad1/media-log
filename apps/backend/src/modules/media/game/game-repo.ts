import { MediaRepository } from '@common/media/media-repository.js';
import type { Game } from '@modules/media/game/game-schema.js';

export class GameRepository extends MediaRepository<Game> {
  constructor() {
    super('game');
  }

  getMediaType(): string {
    return 'game';
  }
}
