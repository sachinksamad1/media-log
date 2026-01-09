import { MediaRepository } from "../../../common/media/media-repository.js";
import { Movie } from "./movie-schema.js";

export class MovieRepository extends MediaRepository<Movie> {
  constructor() {
    super("movie");
  }
}
