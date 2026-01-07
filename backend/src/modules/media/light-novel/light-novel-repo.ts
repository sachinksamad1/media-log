import { BaseRepository } from "../../../common/base/base-repository.js";
import { LightNovel } from "./light-novel-schema.js";

export class LightNovelRepository extends BaseRepository<LightNovel> {
  constructor() {
    super("light_novel");
  }
}
