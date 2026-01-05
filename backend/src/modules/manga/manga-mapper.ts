import { BaseMapper } from "../../common/base/base-mapper.js";
import { Manga } from "./manga-schema.js";
import { MangaDTO } from "./manga-dto.js";

export class MangaMapper extends BaseMapper<Manga, MangaDTO> {
  toDto(entity: Manga): MangaDTO {
    return entity;
  }
}
