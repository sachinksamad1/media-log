import { BaseService } from "../../common/base/base-service.js";
import { MangaRepository } from "./manga-repo.js";
import { Manga } from "./manga-schema.js";

export class MangaService extends BaseService<Manga> {
  constructor() {
    super(new MangaRepository());
  }

  // Mark as completed
  async complete(
    id: string,
    score: number = 7,
    currentChapter: number = 0,
    currentVolume: number = 0,
    totalVolumes: number = 0
  ) {
    // Logic: Set status to Completed and score to the provided value
    return await this.update(id, {
      userStats: {
        score,
        currentChapter,
        currentVolume,
        totalVolumes,
        readingStatus: "Completed",
      },
    });
  }
}
