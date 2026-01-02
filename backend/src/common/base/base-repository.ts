// src/common/base/BaseRepository.ts
import { db } from "../../config/firebase.js";

export abstract class BaseRepository<T extends { id?: string }> {
  protected collection;

  constructor(collectionName: string) {
    this.collection = db.collection(collectionName);
  }

  async getPaginated(limit: number, lastDocId?: string) {
    let query = this.collection.orderBy("createdAt", "desc").limit(limit);

    if (lastDocId) {
      const lastDoc = await this.collection.doc(lastDocId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as T)
    );

    // Get the ID of the last document to pass back as the next cursor
    const nextCursor = data.length === limit ? data[data.length - 1]?.id : null;

    return { data, nextCursor };
  }
}
