import { MediaService } from '../../../common/media/media-service.js';

import { LightNovelRepository } from './light-novel-repo.js';
import type { LightNovel } from './light-novel-schema.js';

export class LightNovelService extends MediaService<LightNovel> {
  constructor() {
    super(new LightNovelRepository());
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
