import { MediaService } from '@common/media/media-service.js';
import { FictionRepository } from '@modules/media/fiction/fiction-repo.js';
import type { FictionSchema } from '@modules/media/fiction/fiction-schema.js';
import { userActivityService } from '@modules/user-activity/user-activity.service.js';
import type { z } from 'zod';

import type { UploadedFile } from '@/common/types/file-types.js';

export class FictionService extends MediaService<
  z.infer<typeof FictionSchema>
> {
  protected repository: FictionRepository;

  constructor() {
    const repo = new FictionRepository();
    super(repo);
    this.repository = repo;
  }

  async create(
    data: z.infer<typeof FictionSchema>,
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
    data: Partial<z.infer<typeof FictionSchema>>,
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
    const fiction = await this.getById(id, userId);

    // Use provided score, or existing score, or default to 0
    const finalScore =
      score !== undefined ? score : fiction.userStats?.score || 0;

    const result = await this.update(
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

    await userActivityService.logActivity(
      userId,
      'COMPLETE',
      'fiction',
      id,
      fiction.title,
      `Score: ${finalScore}`,
    );

    return result;
  }
}
