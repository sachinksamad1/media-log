import { MediaRepository } from "./media-repository.js";
import { AppError } from "../errors/app-error.js";

export abstract class MediaService<T extends { id?: string }> {
  protected repository: MediaRepository<T>;

  constructor(repository: MediaRepository<T>) {
    this.repository = repository;
  }

  async getAll(limit: number, lastDocId?: string) {
    return await this.repository.getAll(limit, lastDocId);
  }

  async getById(id: string) {
    const item = await this.repository.getById(id);
    if (!item) throw new AppError("Item not found", 404);
    return item;
  }

  async create(data: T) {
    return await this.repository.create(data);
  }

  async update(id: string, data: Partial<T>) {
    // Check existence before update
    await this.getById(id);
    return await this.repository.update(id, data);
  }

  async delete(id: string) {
    await this.getById(id);
    return await this.repository.delete(id);
  }
}
