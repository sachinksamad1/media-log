import { MediaRepository } from "../../../common/media/media-repository.js";
import { Manga } from "./manga-schema.js";

export class MangaRepository extends MediaRepository<Manga> {
  constructor() {
    super("manga");
  }
}
