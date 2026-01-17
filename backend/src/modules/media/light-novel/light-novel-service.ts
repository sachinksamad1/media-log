import { MediaService } from '@common/media/media-service.js';
import { LightNovelRepository } from '@modules/media/light-novel/light-novel-repo.js';
import type { LightNovelSchema } from '@modules/media/light-novel/light-novel-schema.js';
import type { z } from 'zod';
import 'multer';

export class LightNovelService extends MediaService<z.infer<typeof LightNovelSchema>> {
  protected repository: LightNovelRepository;

  constructor() {
    const repo = new LightNovelRepository();
    super(repo);
    this.repository = repo;
  }

  async create(
    data: z.infer<typeof LightNovelSchema>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.createWithImage(data, userId, file);
  }
  async update(
    id: string,
    data: Partial<z.infer<typeof LightNovelSchema>>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.updateWithImage(id, data, userId, file);
  }

  async completeSeries(id: string, userId: string, score?: number) {
    const lightNovel = await this.getById(id, userId);

    // Use provided score, or existing score, or default to 0
    const finalScore =
      score !== undefined ? score : lightNovel.userStats?.score || 0;

    return this.update(
      id,
      {
        userStats: {
          ...(lightNovel.userStats || {}),
          status: 'Completed',
          score: finalScore,
        },
      },
      userId,
    );
  }
}
