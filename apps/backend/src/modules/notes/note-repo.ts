import { db } from '@config/firebase.js';
import type { CreateNoteDto, UpdateNoteDto } from '@media-log/shared-types';

import type { DbNote } from './note-types.js';

export class NoteRepository {
  private collection = db.collection('notes');

  async create(userId: string, data: CreateNoteDto): Promise<DbNote> {
    const docRef = this.collection.doc();
    const now = new Date();
    const note = {
      userId,
      mediaId: data.mediaId,
      mediaType: data.mediaType,
      title: data.title,
      content: data.content,
      createdAt: now,
      updatedAt: now,
    };

    await docRef.set(note);
    return { ...note, id: docRef.id } as DbNote;
  }

  async getByMediaId(userId: string, mediaId: string): Promise<DbNote[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('mediaId', '==', mediaId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        ...d,
        id: doc.id,
        createdAt: d.createdAt?.toDate?.() ?? d.createdAt,
        updatedAt: d.updatedAt?.toDate?.() ?? d.updatedAt,
      } as DbNote;
    });
  }

  async getById(userId: string, id: string): Promise<DbNote | null> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) return null;

    const d = doc.data()!;

    if (d.userId !== userId) return null;

    return {
      ...d,
      id: doc.id,
      createdAt: d.createdAt?.toDate?.() ?? d.createdAt,
      updatedAt: d.updatedAt?.toDate?.() ?? d.updatedAt,
    } as DbNote;
  }

  async update(
    userId: string,
    id: string,
    data: UpdateNoteDto,
  ): Promise<DbNote | null> {
    const now = new Date();
    const updatePayload: Record<string, unknown> = {
      content: data.content,
      updatedAt: now,
    };
    if (data.title !== undefined) {
      updatePayload.title = data.title;
    }
    await this.collection.doc(id).update(updatePayload);
    return this.getById(userId, id);
  }

  async delete(_userId: string, id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
