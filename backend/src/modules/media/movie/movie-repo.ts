import { BaseRepository } from "../../../common/base/base-repository.js";
import { Movie } from "./movie-schema.js";

export class MovieRepository extends BaseRepository<Movie> {
  constructor() {
    super("movie");
  }
}
