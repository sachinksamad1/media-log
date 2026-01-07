import { BaseRepository } from "../../../common/base/base-repository.js";
import { NonFiction } from "./non-fiction-schema.js";

export class NonFictionRepository extends BaseRepository<NonFiction> {
  constructor() {
    super("non_fiction");
  }
}
