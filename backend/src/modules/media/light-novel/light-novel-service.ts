import { MediaService } from '@common/media/media-service.js';
import { LightNovelRepository } from '@modules/media/light-novel/light-novel-repo.js';
import type { LightNovelSchema } from '@modules/media/light-novel/light-novel-schema.js';
import { userActivityService } from '@modules/user-activity/user-activity.service.js';
import type { z } from 'zod';

import type { UploadedFile } from '@/common/types/file-types.js';

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
    file?: UploadedFile,
  ) {
    const created = await this.repository.createWithImage(data, userId, file);
    await userActivityService.logActivity(
      userId,
      'CREATE',
      this.repository.collectionName,
      created.id!,
      created.title,
    );
    return created;
  }
  async update(
    id: string,
    data: Partial<z.infer<typeof LightNovelSchema>>,
    userId: string,
    file?: UploadedFile,
  ) {
    // Check existence and title for logging
    const existing = await this.getById(id, userId);

    const updated = await this.repository.updateWithImage(
      id,
      data,
      userId,
      file,
    );

    try {
      if (existing) {
        await userActivityService.logActivity(
          userId,
          'UPDATE',
          this.repository.collectionName,
          id,
          existing.title,
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to log activity:', error);
    }
    return updated;
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
