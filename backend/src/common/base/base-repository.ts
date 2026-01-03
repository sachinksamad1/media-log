import { db } from "../../config/firebase.js";
import { AppError } from "../errors/app-error.js";

export abstract class BaseRepository<T extends { id?: string }> {
  protected collectionName: string;
  protected collection: FirebaseFirestore.CollectionReference;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.collection = db.collection(collectionName);
  }

  async getAll(limit: number = 10, lastDocId?: string) {
    let query = this.collection.orderBy("createdAt", "desc").limit(limit);

    if (lastDocId) {
      const lastDoc = await this.collection.doc(lastDocId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { 
      data, 
      nextCursor: lastVisible ? lastVisible.id : null 
    };
  }

  async getById(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as T) : null;
  }

  async create(data: T): Promise<T> {
    const docRef = await this.collection.add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const docRef = this.collection.doc(id);
    await docRef.update({
      ...data,
      updatedAt: new Date()
    });
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() } as T;
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}