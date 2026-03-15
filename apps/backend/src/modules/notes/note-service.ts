import type { CreateNoteDto, UpdateNoteDto } from '@media-log/shared-types';
import { userActivityService } from '@modules/user-activity/user-activity.service.js';

import { NoteRepository } from './note-repo.js';
import type { DbNote } from './note-types.js';

import { AppError } from '@/common/errors/app-error.js';

export class NoteService {
  private repo = new NoteRepository();

  async create(userId: string, data: CreateNoteDto): Promise<DbNote> {
    const note = await this.repo.create(userId, data);

    await userActivityService.logActivity(
      userId,
      'UPDATE',
      data.mediaType,
      data.mediaId,
      'Note added',
    );

    return note;
  }

  async getByMediaId(userId: string, mediaId: string): Promise<DbNote[]> {
    return this.repo.getByMediaId(userId, mediaId);
  }

  async getById(userId: string, id: string): Promise<DbNote> {
    const note = await this.repo.getById(userId, id);
    if (!note) {
      throw new AppError('Note not found or unauthorized', 404);
    }
    return note;
  }

  async update(
    userId: string,
    id: string,
    data: UpdateNoteDto,
  ): Promise<DbNote> {
    await this.getById(userId, id);
    const updated = await this.repo.update(userId, id, data);
    if (!updated) {
      throw new AppError('Failed to update note', 500);
    }
    return updated;
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.getById(userId, id);
    await this.repo.delete(userId, id);
  }
}
