import { BaseMapper } from "../../common/base/base-mapper.js";
import { Games } from "./games-schema.js";
import { GameDTO } from "./games-dto.js";

export class GamesMapper extends BaseMapper<Games, GameDTO> {
  toDto(entity: Games): GameDTO {
    return entity;
  }
}
