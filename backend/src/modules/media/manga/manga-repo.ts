import { BaseRepository } from "../../../common/base/base-repository.js";
import { Manga } from "./manga-schema.js";

export class MangaRepository extends BaseRepository<Manga> {
  constructor() {
    super("manga");
  }
}
