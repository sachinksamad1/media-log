import { MediaMapper } from "../../../common/media/media-mapper.js";
import { Movie } from "./movie-schema.js";
import { MovieDTO } from "./movie-dto.js";
import { formatTimestamp } from "../../../common/utils/date-utils.js";

export class MovieMapper extends MediaMapper<Movie, MovieDTO> {
  toDto(entity: Movie): MovieDTO {
    return {
      id: entity.id!,
      title: entity.title,
      genre: entity.genre,
      director: entity.director,
      cast: entity.cast,
      origin: entity.origin,
      language: entity.language,
      movieStats: entity.movieStats,
      userStats: entity.userStats,
      imageUrl: entity.imageUrl,
      createdAt: formatTimestamp(entity.createdAt),
      updatedAt: formatTimestamp(entity.updatedAt),
    };
  }
}
