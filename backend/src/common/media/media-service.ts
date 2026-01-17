import type { MediaRepository } from './media-repository.js';
import type { BaseMediaType } from './media-types.js';

import { AppError } from '@/common/errors/app-error.js';

export abstract class MediaService<T extends BaseMediaType> {
  protected repository: MediaRepository<T>;

  constructor(repository: MediaRepository<T>) {
    this.repository = repository;
  }

  async getAll(
    userId: string,
    limit: number,
    lastDocId?: string,
    status?: string,
  ) {
    return this.repository.getAll(userId, limit, lastDocId, status);
  }

  async getById(id: string, userId: string) {
    const item = await this.repository.getById(id, userId);
    if (!item) throw new AppError('Item not found', 404);
    return item;
  }

  async create(data: T, userId: string) {
    return this.repository.create(data, userId);
  }

  async update(id: string, data: Partial<T>, userId: string) {
    // Check existence before update - calling getById will also check ownership via repo
    await this.getById(id, userId);
    return this.repository.update(id, data, userId);
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);
    return this.repository.delete(id, userId);
  }
}
