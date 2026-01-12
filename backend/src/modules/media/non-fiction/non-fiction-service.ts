import { MediaService } from '../../../common/media/media-service.js';

import { NonFictionRepository } from './non-fiction-repo.js';
import type { NonFiction } from './non-fiction-schema.js';

export class NonFictionService extends MediaService<NonFiction> {
  constructor() {
    super(new NonFictionRepository());
  }

  // Mark as completed
  complete(id: string, score: number = 7) {
    return this.update(id, {
      userStats: {
        score,
        status: 'Completed',
      },
    });
  }
}
