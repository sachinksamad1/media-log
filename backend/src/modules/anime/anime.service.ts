import { AnimeRepository } from "./anime.repo.js";
import { Anime } from "./anime.schema.js";

export class AnimeService {
  constructor(private animeRepo: AnimeRepository) {}

  async addAnime(data: Anime) {
    // You can add business logic here (e.g., checking for duplicates)
    return await this.animeRepo.create(data);
  }

  async getAllAnime() {
    return await this.animeRepo.findAll();
  }

  async getAnimeById(id: string) {
    return await this.animeRepo.findById(id);
  }

  async updateAnime(id: string, data: Partial<Anime>) {
    // Always update the 'updatedAt' timestamp on any edit
    const updateData = { ...data, updatedAt: new Date() };
    return await this.animeRepo.update(id, updateData);
  }

  async removeAnime(id: string) {
    const anime = await this.animeRepo.findById(id);
    if (!anime) return false;

    await this.animeRepo.delete(id);
    return true;
  }
}
