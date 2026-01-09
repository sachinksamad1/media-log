import { MediaService } from "../../../common/media/media-service.js";
import { MangaRepository } from "./manga-repo.js";
import { Manga } from "./manga-schema.js";

export class MangaService extends MediaService<Manga> {
  constructor() {
    super(new MangaRepository());
  }

  // Mark as completed
  async complete(id: string, score: number = 7) {
    // Logic: Set status to Completed and score to the provided value
    return await this.update(id, {
      userStats: {
        score: score,
        status: "Completed",
      },
    });
  }
}
