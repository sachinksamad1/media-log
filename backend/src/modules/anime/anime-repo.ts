import { BaseRepository } from "../../common/base/base-repository.js";
import { Anime } from "./anime-schema.js";

export class AnimeRepository extends BaseRepository<Anime> {
  constructor() {
    super("anime"); // Defines the Firestore collection name
  }
  // Add custom queries here if needed (e.g., findByDirector)
}
