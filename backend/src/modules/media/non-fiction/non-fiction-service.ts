import { MediaService } from '@common/media/media-service.js';
import { NonFictionRepository } from '@modules/media/non-fiction/non-fiction-repo.js';
import type { NonFictionSchema } from '@modules/media/non-fiction/non-fiction-schema.js';
import type { z } from 'zod';
import 'multer';

export class NonFictionService extends MediaService<z.infer<typeof NonFictionSchema>> {
  protected repository: NonFictionRepository;

  constructor() {
    const repo = new NonFictionRepository();
    super(repo);
    this.repository = repo;
  }

  async create(
    data: z.infer<typeof NonFictionSchema>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.createWithImage(data, userId, file);
  }
  async update(
    id: string,
    data: Partial<z.infer<typeof NonFictionSchema>>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.updateWithImage(id, data, userId, file);
  }

  async completeSeries(id: string, userId: string, score?: number) {
    const nonFiction = await this.getById(id, userId);

    // Use provided score, or existing score, or default to 0
    const finalScore =
      score !== undefined ? score : nonFiction.userStats?.score || 0;

    return this.update(
      id,
      {
        userStats: {
          ...(nonFiction.userStats || {}),
          status: 'Completed',
          score: finalScore,
        },
      },
      userId,
    );
  }
}
