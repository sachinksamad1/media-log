import { MediaService } from '@common/media/media-service.js';
import { userActivityService } from '@modules/user-activity/user-activity.service.js';
import type { z } from 'zod';

import type { UploadedFile } from '@/common/types/file-types.js';
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
    data: Partial<z.infer<typeof MangaSchema>>,
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
