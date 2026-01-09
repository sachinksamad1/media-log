import { MediaService } from "../../../common/media/media-service.js";
import { NonFictionRepository } from "./non-fiction-repo.js";
import { NonFiction } from "./non-fiction-schema.js";

export class NonFictionService extends MediaService<NonFiction> {
  constructor() {
    super(new NonFictionRepository());
  }

  // Mark as completed
  async complete(id: string, score: number = 7) {
    // Logic: Set readingStatus to Completed and score to the provided value
    return await this.update(id, {
      userStats: {
        score,
        status: "Completed",
      },
    });
  }
}
