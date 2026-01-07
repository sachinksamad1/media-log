import { BaseRepository } from "../../../common/base/base-repository.js";
import { Anime } from "./anime-schema.js";

export class AnimeRepository extends BaseRepository<Anime> {
  constructor() {
    super("anime"); // Defines the Firestore collection name
  }
  // Add custom queries here if needed (e.g., findByDirector)
  
  // Find anime by title
  async findAnimeByTitle(title: string) {
    return this.collection.where("title", "==", title).get();
  }

  // Find anime by genre
  async findAnimeByGenre(genre: string) {
    return this.collection.where("genre", "==", genre).get();
  }

  // Find anime by year
  async findAnimeByYear(year: number) {
    return this.collection.where("year", "==", year).get();
  }
}
