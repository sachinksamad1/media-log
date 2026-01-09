import { MediaRepository } from "../../../common/media/media-repository.js";
import { NonFiction } from "./non-fiction-schema.js";

export class NonFictionRepository extends MediaRepository<NonFiction> {
  constructor() {
    super("non_fiction");
  }
}
