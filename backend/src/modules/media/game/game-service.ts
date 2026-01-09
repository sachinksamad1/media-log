import { MediaService } from "../../../common/media/media-service.js";
import { GameRepository } from "./game-repo.js";
import { Games } from "./game-schema.js";

export class GamesService extends MediaService<Games> {
  constructor() {
    super(new GameRepository());
  }

  // Mark as Game completed
  async completeGame(id: string, score: number = 7) {
    // Logic: Set completedAt to now, score to 7
    return await this.update(id, {
      userStats: {
        score: score,
        status: "Completed",
      },
    });
  }
}
