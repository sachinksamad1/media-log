import { MediaService } from '@common/media/media-service.js';
import { MovieRepository } from '@modules/media/movie/movie-repo.js';
import type { MovieSchema } from '@modules/media/movie/movie-schema.js';
import { userActivityService } from '@modules/user-activity/user-activity.service.js';
import type { z } from 'zod';

import type { UploadedFile } from '@/common/types/file-types.js';

export class MovieService extends MediaService<z.infer<typeof MovieSchema>> {
  protected repository: MovieRepository;

  constructor() {
    const repo = new MovieRepository();
    super(repo);
    this.repository = repo;
  }

  async create(
    data: z.infer<typeof MovieSchema>,
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
    data: Partial<z.infer<typeof MovieSchema>>,
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

  async completeMovie(id: string, userId: string, score?: number) {
    const movie = await this.getById(id, userId);

    const finalScore =
      score !== undefined ? score : movie.userStats?.score || 0;

    return this.update(
      id,
      {
        userStats: {
          ...(movie.userStats || {}),
          status: 'Completed',
          score: finalScore,
        },
      },
      userId,
    );
  }
}
