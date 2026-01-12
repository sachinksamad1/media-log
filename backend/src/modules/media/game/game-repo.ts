import { MediaRepository } from '../../../common/media/media-repository.js';

import type { Games } from './game-schema.js';

export class GameRepository extends MediaRepository<Games> {
  constructor() {
    super('game');
  }

  getMediaType(): string {
    return 'game';
  }
}
