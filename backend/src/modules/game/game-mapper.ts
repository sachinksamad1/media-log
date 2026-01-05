import { BaseMapper } from "../../common/base/base-mapper.js";
import { Games } from "./game-schema.js";
import { GameDTO } from "./game-dto.js";

export class GamesMapper extends BaseMapper<Games, GameDTO> {
  toDto(entity: Games): GameDTO {
    return entity;
  }
}
