import { BaseMapper } from "../../common/base/base-mapper.js";
import { LightNovel } from "./light-novel-schema.js";
import { LightNovelDTO } from "./light-novel-dto.js";

export class LightNovelMapper extends BaseMapper<LightNovel, LightNovelDTO> {
  toDto(entity: LightNovel): LightNovelDTO {
    return entity;
  }
}
