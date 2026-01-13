import type { CollectionReference } from 'firebase-admin/firestore';

import { db } from '../../config/firebase.js';
import { AppError } from '../errors/app-error.js';
import { StorageHelper } from '../utils/firestorage-helper.js';

import type { MediaStatus, BaseMediaType } from './media-types.js';

export abstract class MediaRepository<T extends BaseMediaType> {
  public readonly collectionName: string;
  protected readonly collection: CollectionReference;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.collection = db.collection(collectionName);
  }

  create(data: T) {
    return this.createWithImage(data);
  }

  update(id: string, data: Partial<T>) {
    return this.updateWithImage(id, data);
  }

  // Helper to generate keywords for partial search
  private generateSearchKeywords(title: string): string[] {
    const words = title.toLowerCase().split(/\s+/);
    const keywords = new Set<string>();

    // Add full title for prefix search backup
    // keywords.add(title.toLowerCase());

    words.forEach((word) => {
      // Generate all prefixes for each word
      let current = '';
      for (const char of word) {
        current += char;
        keywords.add(current);
      }
    });

    return Array.from(keywords);
  }

  async createWithImage(data: T, imageFile?: Express.Multer.File): Promise<T> {
    let imageUrl = data.imageUrl;

    if (imageFile) {
      imageUrl = await StorageHelper.uploadMediaImage(
        imageFile,
        this.collectionName,
      );
    }

    const payload: any = {
      ...data,
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
    imageFile?: Express.Multer.File,
  ): Promise<T> {
    const docRef = this.collection.doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      throw new AppError(`${this.collectionName} item not found`, 404);
    }

    const oldData = existing.data() as T;

    const updateData: any = {
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

  async delete(id: string): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return;

    const data = doc.data() as T;

    if (data.imageUrl) {
      await StorageHelper.deleteMediaImage(data.imageUrl);
    }

    await docRef.delete();
  }

  async getAll(limit = 10, lastDocId?: string, status?: string) {
    // Start with the collection (which is a Query)
    let query: FirebaseFirestore.Query = this.collection;

    // Apply Filter FIRST
    if (status && status !== 'All') {
      query = query.where('userStats.status', '==', status);
      // NOTE: We generally avoid orderBy('createdAt') here to prevent "Missing Index" errors
      // unless a composite index (status + createdAt) exists in Firestore.
      // If you have created the index, you can uncomment the next line:
      // query = query.orderBy('createdAt', 'desc');
    } else {
      // Default ordering for "All"
      query = query.orderBy('createdAt', 'desc');
    }

    query = query.limit(limit);

    if (lastDocId) {
      const last = await this.collection.doc(lastDocId).get();
      if (last.exists) query = query.startAfter(last);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((d) => ({ ...(d.data() as T), id: d.id }));
    const lastVisible = snapshot.docs.at(-1);

    return { data, nextCursor: lastVisible?.id ?? null };
  }

  async getById(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? { ...(doc.data() as T), id: doc.id } : null;
  }

  async searchByTitle(
    query: string,
    limitCount = 5,
  ): Promise<(T & { id: string })[]> {
    const term = query.toLowerCase();

    // If the query is a single word (no spaces), use the keywords array for flexible partial matching
    // allowing "Torun" to find "Torunka"
    if (!term.includes(' ')) {
      const keywordSnapshot = await this.collection
        .where('searchKeywords', 'array-contains', term)
        .limit(limitCount)
        .get();

      return keywordSnapshot.docs.map((d) => ({
        ...(d.data() as T),
        id: d.id,
      })) as (T & { id: string })[];
    }

    // Fallback to titleLower range query for multi-word phrases "Days at"
    const snapshot = await this.collection
      .where('titleLower', '>=', term)
      .where('titleLower', '<=', term + '\uf8ff')
      .limit(limitCount)
      .get();

    return snapshot.docs.map((d) => ({
      ...(d.data() as T),
      id: d.id,
    })) as (T & { id: string })[];
  }

  async getCount(): Promise<number> {
    const snapshot = await this.collection.count().get();
    return snapshot.data().count;
  }

  async getCountByStatus(status: MediaStatus): Promise<number> {
    const snapshot = await this.collection
      .where('userStats.status', '==', status)
      .count()
      .get();

    return snapshot.data().count;
  }
}
