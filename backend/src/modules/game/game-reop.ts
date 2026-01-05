import { BaseRepository } from "../../common/base/base-repository.js";
import { Games } from "./game-schema.js";

export class GameRepository extends BaseRepository<Games> {
  constructor() {
    super("game");
  }
}
