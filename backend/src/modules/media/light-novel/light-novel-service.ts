import { BaseService } from "../../../common/base/base-service.js";
import { LightNovelRepository } from "./light-novel-repo.js";
import { LightNovel } from "./light-novel-schema.js";

export class LightNovelService extends BaseService<LightNovel> {
  constructor() {
    super(new LightNovelRepository());
  }

  // Mark as completed
  async complete(
    id: string,
    score: number = 7,
    currentReadingVolume: number = 1
  ) {
    // Logic: Set status to Completed and score to the provided value
    return await this.update(id, {
      userStats: {
        score,
        currentReadingVolume,
        readingStatus: "Completed",
      },
    });
  }
}
