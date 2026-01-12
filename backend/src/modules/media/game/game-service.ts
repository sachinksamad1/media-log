import { MediaService } from '../../../common/media/media-service.js';

import { GameRepository } from './game-repo.js';
import type { Games } from './game-schema.js';

export class GamesService extends MediaService<Games> {
  constructor() {
    super(new GameRepository());
  }

  // Mark as Game completed
  completeGame(id: string, score: number = 7) {
    return this.update(id, {
      userStats: {
        score,
        status: 'Completed',
      },
    });
  }
}
