import 'multer';
import { MediaService } from '@common/media/media-service.js';
import type { z } from 'zod';

import { MangaRepository } from '@/modules/media/manga/manga-repo.js';
import type { MangaSchema } from '@/modules/media/manga/manga-schema.js';

export class MangaService extends MediaService<z.infer<typeof MangaSchema>> {
  protected repository: MangaRepository;

  constructor() {
    const repo = new MangaRepository();
    super(repo);
    this.repository = repo;
  }

  async create(
    data: z.infer<typeof MangaSchema>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.createWithImage(data, userId, file);
  }
  async update(
    id: string,
    data: Partial<z.infer<typeof MangaSchema>>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.updateWithImage(id, data, userId, file);
  }

  async completeSeries(id: string, userId: string, score?: number) {
    const manga = await this.getById(id, userId);

    // Use provided score, or existing score, or default to 0
    const finalScore =
      score !== undefined ? score : manga.userStats?.score || 0;

    return this.update(
      id,
      {
        userStats: {
          ...(manga.userStats || {}),
          status: 'Completed',
          score: finalScore,
        },
      },
      userId,
    );
  }
}
