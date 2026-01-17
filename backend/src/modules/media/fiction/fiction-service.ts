import { MediaService } from '@common/media/media-service.js';
import { FictionRepository } from '@modules/media/fiction/fiction-repo.js';
import type { FictionSchema } from '@modules/media/fiction/fiction-schema.js';
import type { z } from 'zod';
import 'multer';

export class FictionService extends MediaService<z.infer<typeof FictionSchema>> {
  protected repository: FictionRepository;

  constructor() {
    const repo = new FictionRepository();
    super(repo);
    this.repository = repo;
  }

  async create(
    data: z.infer<typeof FictionSchema>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.createWithImage(data, userId, file);
  }
  async update(
    id: string,
    data: Partial<z.infer<typeof FictionSchema>>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.updateWithImage(id, data, userId, file);
  }

  async completeSeries(id: string, userId: string, score?: number) {
    const fiction = await this.getById(id, userId);

    // Use provided score, or existing score, or default to 0
    const finalScore =
      score !== undefined ? score : fiction.userStats?.score || 0;

    return this.update(
      id,
      {
        userStats: {
          ...(fiction.userStats || {}),
          status: 'Completed',
          score: finalScore,
        },
      },
      userId,
    );
  }
}
