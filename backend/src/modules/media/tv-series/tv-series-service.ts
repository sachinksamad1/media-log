import { MediaService } from '@common/media/media-service.js';
import { TvSeriesRepository } from '@modules/media/tv-series/tv-series-repo.js';
import type { TvSeriesSchema } from '@modules/media/tv-series/tv-series-schema.js';
import type { z } from 'zod';
import 'multer' ;

export class TvSeriesService extends MediaService<z.infer<typeof TvSeriesSchema>> {
  protected repository: TvSeriesRepository;

  constructor() {
    const repo = new TvSeriesRepository();
    super(repo);
    this.repository = repo;
  }

  async create(
    data: z.infer<typeof TvSeriesSchema>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.createWithImage(data, userId, file);
  }
  async update(
    id: string,
    data: Partial<z.infer<typeof TvSeriesSchema>>,
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
