import { MediaService } from '../../../common/media/media-service.js';

import { FictionRepository } from './fiction-repo.js';
import type { Fiction } from './fiction-schema.js';

export class FictionService extends MediaService<Fiction> {
  constructor() {
    super(new FictionRepository());
  }

  // Mark as completed
  completeSeries(id: string, score: number = 7) {
    return this.update(id, {
      userStats: {
        status: 'Completed',
        score,
      },
    });
  }
}
