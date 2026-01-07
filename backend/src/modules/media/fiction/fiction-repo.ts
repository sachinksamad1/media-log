import { BaseRepository } from "../../../common/base/base-repository.js";
import { Fiction } from "./fiction-schema.js";

export class FictionRepository extends BaseRepository<Fiction> {
  constructor() {
    super("fiction");
  }
}
