import { MediaService } from "../../../common/media/media-service.js";
import { TvSeriesRepository } from "./tv-series-repo.js";
import { TvSeries } from "./tv-series-schema.js";

export class TvSeriesService extends MediaService<TvSeries> {
  constructor() {
    super(new TvSeriesRepository());
  }

  // Mark as completed
  async complete(id: string, score: number = 7) {
    // Logic: Set status to Completed and score to the provided value
    return await this.update(id, {
      userStats: {
        score,
        status: "Completed",
      },
    });
  }
}
