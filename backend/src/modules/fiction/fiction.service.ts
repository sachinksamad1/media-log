import { FictionRepository } from "./fiction.repo.js";
import { Fiction } from "./fiction.schema.js";

export class FictionService {
  constructor(private fictionRepo: FictionRepository) {}

  async addFiction(data: Fiction) {
    // You can add business logic here (e.g., checking for duplicates)
    return await this.fictionRepo.create(data);
  }

  async getAllFiction() {
    return await this.fictionRepo.findAll();
  }

  async getFictionById(id: string) {
    return await this.fictionRepo.findById(id);
  }

  async updateFiction(id: string, data: Partial<Fiction>) {
    // Always update the 'updatedAt' timestamp on any edit
    const updateData = { ...data, updatedAt: new Date() };
    return await this.fictionRepo.update(id, updateData);
  }

  async removeFiction(id: string) {
    const fiction = await this.fictionRepo.findById(id);
    if (!fiction) return false;

    await this.fictionRepo.delete(id);
    return true;
  }
}
