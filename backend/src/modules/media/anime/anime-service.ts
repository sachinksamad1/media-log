import type { z } from 'zod';
import 'multer';

import { MediaService } from '../../../common/media/media-service.js';

import { AnimeRepository } from './anime-repo.js';
import type { AnimeSchema } from './anime-schema.js';

export class AnimeService extends MediaService<z.infer<typeof AnimeSchema>> {
  protected repository: AnimeRepository;

  constructor() {
    const repo = new AnimeRepository();
    super(repo);
    this.repository = repo;
  }

  async create(
    data: z.infer<typeof AnimeSchema>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.createWithImage(data, userId, file);
  }
  async update(
    id: string,
    data: Partial<z.infer<typeof AnimeSchema>>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.updateWithImage(id, data, userId, file);
  }

  async completeSeries(id: string, userId: string, score?: number) {
    const anime = await this.getById(id, userId);

    // Use provided score, or existing score, or default to 0
    const finalScore =
      score !== undefined ? score : anime.userStats?.score || 0;

    return this.update(
      id,
      {
        userStats: {
          ...(anime.userStats || {}),
          status: 'Completed',
          score: finalScore,
        },
      },
      userId,
    );
  }
}
