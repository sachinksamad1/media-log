import { BaseService } from "../../common/base/base-service.js";
import { AnimeRepository } from "./anime-repo.js";
import { Anime } from "./anime-schema.js";

export class AnimeService extends BaseService<Anime> {
  constructor() {
    super(new AnimeRepository());
  }

  // Mark as completed
  async completeSeries(id: string) {
    const anime = await this.getById(id);
    // Logic: Set status to Completed and score to 10 automatically
    return await this.update(id, { status: "Completed", score: 10 });
  }

}
