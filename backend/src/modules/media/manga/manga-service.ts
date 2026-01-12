import { MediaService } from '../../../common/media/media-service.js';

import { MangaRepository } from './manga-repo.js';
import type { Manga } from './manga-schema.js';

export class MangaService extends MediaService<Manga> {
  constructor() {
    super(new MangaRepository());
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
