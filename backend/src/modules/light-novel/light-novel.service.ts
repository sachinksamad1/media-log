import { LightNovelRepository } from "./light-novel.repo.js";
import { LightNovel } from "./light-novel.schema.js";

export class LightNovelService {
  constructor(private lightNovelRepo: LightNovelRepository) {}

  async addLightNovel(data: LightNovel) {
    // You can add business logic here (e.g., checking for duplicates)
    return await this.lightNovelRepo.create(data);
  }

  async getAllLightNovel() {
    return await this.lightNovelRepo.findAll();
  }

  async getLightNovelById(id: string) {
    return await this.lightNovelRepo.findById(id);
  }

  async updateLightNovel(id: string, data: Partial<LightNovel>) {
    // Always update the 'updatedAt' timestamp on any edit
    const updateData = { ...data, updatedAt: new Date() };
    return await this.lightNovelRepo.update(id, updateData);
  }

  async removeLightNovel(id: string) {
    const lightNovel = await this.lightNovelRepo.findById(id);
    if (!lightNovel) return false;

    await this.lightNovelRepo.delete(id);
    return true;
  }
}
