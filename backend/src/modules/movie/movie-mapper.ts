import { BaseMapper } from "../../common/base/base-mapper.js";
import { Movie } from "./movie-schema.js";
import { MovieDTO } from "./movie-dto.js";

export class MovieMapper extends BaseMapper<Movie, MovieDTO> {
  toDto(entity: Movie): MovieDTO {
    return entity;
  }
}
