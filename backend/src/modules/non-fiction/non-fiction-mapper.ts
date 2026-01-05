import { BaseMapper } from "../../common/base/base-mapper.js";
import { NonFiction } from "./non-fiction-schema.js";
import { NonFictionDTO } from "./non-fiction-dto.js";

export class NonFictionMapper extends BaseMapper<NonFiction, NonFictionDTO> {
  toDto(entity: NonFiction): NonFictionDTO {
    return entity;
  }
}
