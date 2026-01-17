import { MediaService } from '@common/media/media-service.js';
import { MovieRepository } from '@modules/media/movie/movie-repo.js';
import type { MovieSchema } from '@modules/media/movie/movie-schema.js';
import type { z } from 'zod';
import 'multer';

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
    file?: Express.Multer.File,
  ) {
    return this.repository.createWithImage(data, userId, file);
  }
  async update(
    id: string,
    data: Partial<z.infer<typeof MovieSchema>>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.updateWithImage(id, data, userId, file);
  }

  async completeMovie(id: string, userId: string, score?: number) {
    const movie = await this.getById(id, userId);

    const finalScore = score !== undefined ? score : movie.userStats?.score || 0;

    return this.update(id, { userStats: { ...(movie.userStats || {}), status: 'Completed', score: finalScore, } }, userId);
  }
}
