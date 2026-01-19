import { MediaService } from '@common/media/media-service.js';
import { NonFictionRepository } from '@modules/media/non-fiction/non-fiction-repo.js';
import type { NonFictionSchema } from '@modules/media/non-fiction/non-fiction-schema.js';
import { userActivityService } from '@modules/user-activity/user-activity.service.js';
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
    data: Partial<z.infer<typeof NonFictionSchema>>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    // Check existence and title for logging
    const existing = await this.getById(id, userId);
    
    const updated = await this.repository.updateWithImage(id, data, userId, file);
    
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
