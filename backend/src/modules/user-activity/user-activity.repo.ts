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
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as UserActivity[];
  }
}
