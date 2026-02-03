import type { CollectionReference } from 'firebase-admin/firestore';

import type { MediaStatus, BaseMediaType } from './media-types.js';

import { AppError } from '@/common/errors/app-error.js';
import type { UploadedFile } from '@/common/types/file-types.js';
import { StorageHelper } from '@/common/utils/firestorage-helper.js';
import { db } from '@/config/firebase.js';

export abstract class MediaRepository<T extends BaseMediaType> {
  public readonly collectionName: string;
  protected readonly collection: CollectionReference;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.collection = db.collection(collectionName);
  }

  create(data: T, userId: string): Promise<T> {
    return this.createWithImage(data, userId);
  }

  update(id: string, data: Partial<T>, userId: string): Promise<T> {
    return this.updateWithImage(id, data, userId);
  }

  // Helper to generate keywords for partial search
  private generateSearchKeywords(title: string): string[] {
    const words = title.toLowerCase().split(/\s+/);
    const keywords = new Set<string>();

    words.forEach((word) => {
      let current = '';
      for (const char of word) {
        current += char;
        keywords.add(current);
      }
    });

    return Array.from(keywords);
  }

  async createWithImage(
    data: T,
    userId: string,
    imageFile?: UploadedFile,
  ): Promise<T> {
    let imageUrl = data.imageUrl;

    if (imageFile) {
      imageUrl = await StorageHelper.uploadMediaImage(
        imageFile,
        this.collectionName,
      );
    }

    const payload: T & {
      userId: string;
      titleLower?: string;
      searchKeywords?: string[];
    } = {
      ...data,
      userId, // Associate with user
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (data.title) {
      const title = data.title;
      payload.titleLower = title.toLowerCase();
      payload.searchKeywords = this.generateSearchKeywords(title);
    }

    const docRef = await this.collection.add(payload);

    return { ...(payload as T), id: docRef.id };
  }

  async updateWithImage(
    id: string,
    data: Partial<T>,
    userId: string,
    imageFile?: UploadedFile,
  ): Promise<T> {
    const docRef = this.collection.doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      throw new AppError(`${this.collectionName} item not found`, 404);
    }

    const oldData = existing.data() as T & { userId?: string };

    // Check ownership
    if (oldData.userId && oldData.userId !== userId) {
      throw new AppError('Unauthorized access to this resource', 403);
    }

    const updateData: Partial<T> & {
      titleLower?: string;
      searchKeywords?: string[];
    } = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.title) {
      const title = data.title;
      updateData.titleLower = title.toLowerCase();
      updateData.searchKeywords = this.generateSearchKeywords(title);
    }

    if (imageFile) {
      updateData.imageUrl = await StorageHelper.uploadMediaImage(
        imageFile,
        this.collectionName,
      );

      if (oldData.imageUrl) {
        await StorageHelper.deleteMediaImage(oldData.imageUrl);
      }
    }

    await docRef.update(updateData);

    const updated = await docRef.get();
    return { ...(updated.data() as T), id: updated.id };
  }

  async delete(id: string, userId: string): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return;

    const data = doc.data() as T & { userId?: string };

    // Check ownership
    if (data.userId && data.userId !== userId) {
      throw new AppError('Unauthorized access to this resource', 403);
    }

    if (data.imageUrl) {
      await StorageHelper.deleteMediaImage(data.imageUrl);
    }

    await docRef.delete();
  }

  async getAll(
    userId: string,
    limit = 10,
    lastDocId?: string,
    status?: string,
  ) {
    let query: FirebaseFirestore.Query = this.collection;

    // Filter by userId
    query = query.where('userId', '==', userId);

    if (status && status !== 'All') {
      query = query.where('userStats.status', '==', status);
    }

    // Default ordering for "All"
    query = query.limit(limit);

    if (lastDocId) {
      const last = await this.collection.doc(lastDocId).get();
      if (last.exists) query = query.startAfter(last);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((d) => ({
      ...(d.data() as T),
      id: d.id,
    }));
    const lastVisible = snapshot.docs.at(-1);

    return { data, nextCursor: lastVisible?.id ?? null };
  }

  async getById(id: string, userId: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data() as T & { userId?: string };

    // Check ownership
    if (data.userId && data.userId !== userId) {
      throw new AppError('Unauthorized access to this resource', 403);
    }

    return { ...data, id: doc.id };
  }

  /*
   * Search by title
   */
  async searchByTitle(
    query: string,
    userId: string,
    limitCount = 5,
  ): Promise<(T & { id: string })[]> {
    const term = query.toLowerCase();

    let firestoreQuery = this.collection.where('userId', '==', userId);

    if (!term.includes(' ')) {
      firestoreQuery = firestoreQuery
        .where('searchKeywords', 'array-contains', term)
        .limit(limitCount);

      const snapshot = await firestoreQuery.get();
      return snapshot.docs.map((d) => ({
        ...(d.data() as T),
        id: d.id,
      })) as (T & { id: string })[];
    }

    // Range query on titleLower
    firestoreQuery = firestoreQuery
      .where('titleLower', '>=', term)
      .where('titleLower', '<=', term + '\uf8ff')
      .limit(limitCount);

    const snapshot = await firestoreQuery.get();
    return snapshot.docs.map((d) => ({
      ...(d.data() as T),
      id: d.id,
    })) as (T & { id: string })[];
  }

  async getCount(userId: string): Promise<number> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .count()
      .get();
    return snapshot.data().count;
  }

  async getCountByStatus(
    status: MediaStatus | 'Ongoing',
    userId: string,
  ): Promise<number> {
    // Handle aggregated 'Ongoing' status - query for all activity verbs
    if (status === 'Ongoing') {
      const activityStatuses: MediaStatus[] = [
        'Watching',
        'Reading',
        'Playing',
      ];
      const counts = await Promise.all(
        activityStatuses.map(async (activityStatus) => {
          const snapshot = await this.collection
            .where('userId', '==', userId)
            .where('userStats.status', '==', activityStatus)
            .count()
            .get();
          return snapshot.data().count;
        }),
      );
      return counts.reduce((sum, count) => sum + count, 0);
    }

    // Query for specific raw status
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('userStats.status', '==', status)
      .count()
      .get();

    return snapshot.data().count;
  }
}
