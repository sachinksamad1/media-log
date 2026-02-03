import { userActivityService } from '@modules/user-activity/user-activity.service.js';

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
    const created = await this.repository.create(data, userId);
    await userActivityService.logActivity(
      userId,
      'CREATE',
      this.repository.collectionName,
      created.id!,
      created.title,
    );
    return created;
  }

  async update(id: string, data: Partial<T>, userId: string) {
    // Check existence before update - calling getById will also check ownership via repo
    const existing = await this.getById(id, userId);
    const updated = await this.repository.update(id, data, userId);

    await userActivityService.logActivity(
      userId,
      'UPDATE',
      this.repository.collectionName,
      id,
      existing.title,
    );
    return updated;
  }

  async delete(id: string, userId: string) {
    const existing = await this.getById(id, userId);
    await this.repository.delete(id, userId);
    await userActivityService.logActivity(
      userId,
      'DELETE',
      this.repository.collectionName,
      id,
      existing.title,
    );
  }
}
