import { MediaRepository } from "../../../common/media/media-repository.js";
import { LightNovel } from "./light-novel-schema.js";

export class LightNovelRepository extends MediaRepository<LightNovel> {
  constructor() {
    super("light_novel");
  }
}
