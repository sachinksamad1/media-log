import { db } from "../../config/firebase.js";
import { LightNovel } from "./light-novel.schema.js";

export class LightNovelRepository {
  private collection = db.collection("light-novel");

  async create(data: LightNovel): Promise<LightNovel> {
    const docRef = await this.collection.add(data); // Auto-generates ID
    return { ...data, id: docRef.id };
  }

  async findAll(): Promise<LightNovel[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as LightNovel));
  }

  async findById(id: string): Promise<LightNovel | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as LightNovel) : null;
  }

  async update(id: string, data: Partial<LightNovel>): Promise<LightNovel | null> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    await docRef.update(data);
    return { id: doc.id, ...doc.data(), ...data } as LightNovel;
  }

  async delete(id: string): Promise<boolean> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return false;
    }

    await docRef.delete();
    return true;
  }
}
