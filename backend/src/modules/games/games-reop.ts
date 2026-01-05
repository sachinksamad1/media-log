import { BaseRepository } from "@/common/base/base-repository.js";
import { Games } from "./games-schema.js";

export class GameRepository extends BaseRepository<Games> {
  constructor() {
    super("games");
  }
}
