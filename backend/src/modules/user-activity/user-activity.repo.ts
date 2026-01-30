import type { CollectionReference } from 'firebase-admin/firestore';

import type { UserActivity } from './user-activity.schema.js';

import { db } from '@/config/firebase.js';

export class UserActivityRepository {
  private collection: CollectionReference;

  constructor() {
    this.collection = db.collection('user_activities');
  }

  async create(activity: UserActivity): Promise<void> {
    // We let Firestore generate the ID
    await this.collection.add(activity);
  }

  async getRecent(userId: string, limit: number = 10): Promise<UserActivity[]> {
    try {
      // NOTE: This query requires a Composite Index in Firestore
      // Fields: userId (Ascending/Descending), createdAt (Descending)
      // If this fails with "The query requires an index", follow the link in the backend console.
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        let createdAt = data.createdAt;

        // Convert Firestore Timestamp to Date
        if (createdAt && typeof createdAt.toDate === 'function') {
          createdAt = createdAt.toDate();
        }

        return {
          ...data,
          id: doc.id,
          createdAt,
        };
      }) as UserActivity[];
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      if (err?.code === 9 || err?.message?.includes('index')) {
        // Log the full error to see the index creation link
        // eslint-disable-next-line no-console
        console.error('Firestore Index Missing:', error);
        throw new Error(
          'Firestore Index Missing. Check backend logs for the creation link.',
        );
      }
      throw error;
    }
  }
}
