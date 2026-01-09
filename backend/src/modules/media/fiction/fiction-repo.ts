import { MediaRepository } from "../../../common/media/media-repository.js";
import { Fiction } from "./fiction-schema.js";

export class FictionRepository extends MediaRepository<Fiction> {
  constructor() {
    super("fiction");
  }
}
