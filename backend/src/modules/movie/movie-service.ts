import { BaseService } from "../../common/base/base-service.js";
import { MovieRepository } from "./movie-repo.js";
import { Movie } from "./movie-schema.js";

export class MovieService extends BaseService<Movie> {
  constructor() {
    super(new MovieRepository());
  }

  // Mark as completed
  async complete(
    id: string,
    score: number = 7,
  ) {
    // Logic: Set status to Completed and score to the provided value
    return await this.update(id, {
      userStats: {
        score,
        status: "Completed",
      },
    });
  }
}
