import { MediaService } from '@common/media/media-service.js';
import { GameRepository } from '@modules/media/game/game-repo.js';
import type { GameSchema } from '@modules/media/game/game-schema.js';
import type { z } from 'zod';
import 'multer';

export class GameService extends MediaService<z.infer<typeof GameSchema>> {
  protected repository: GameRepository;

  constructor() {
    const repo = new GameRepository();
    super(repo);
    this.repository = repo;
  }

  async create(
    data: z.infer<typeof GameSchema>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.createWithImage(data, userId, file);
  }
  async update(
    id: string,
    data: Partial<z.infer<typeof GameSchema>>,
    userId: string,
    file?: Express.Multer.File,
  ) {
    return this.repository.updateWithImage(id, data, userId, file);
  }

  async completeSeries(id: string, userId: string, score?: number) {
    const game = await this.getById(id, userId);

    // Use provided score, or existing score, or default to 0
    const finalScore =
      score !== undefined ? score : game.userStats?.score || 0;

    return this.update(
      id,
      {
        userStats: {
          ...(game.userStats || {}),
          status: 'Completed',
          score: finalScore,
        },
      },
      userId,
    );
  }
}
