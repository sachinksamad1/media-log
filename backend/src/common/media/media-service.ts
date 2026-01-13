import { AppError } from '../errors/app-error.js';

import type { MediaRepository } from './media-repository.js';

export abstract class MediaService<T extends { id?: string }> {
  protected repository: MediaRepository<T>;

  constructor(repository: MediaRepository<T>) {
    this.repository = repository;
  }

  async getAll(limit: number, lastDocId?: string, status?: string) {
    return this.repository.getAll(limit, lastDocId, status);
  }

  async getById(id: string) {
    const item = await this.repository.getById(id);
    if (!item) throw new AppError('Item not found', 404);
    return item;
  }

  async create(data: T) {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>) {
    // Check existence before update
    await this.getById(id);
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    await this.getById(id);
    return this.repository.delete(id);
  }
}
