import { db } from "../../config/firebase.js";
import { Fiction, FictionSchema } from "./fiction.schema.js";

export class FictionRepository {
  private collection = db.collection("fiction");

  async create(data: Fiction): Promise<Fiction> {
    const docRef = await this.collection.add(data); // Auto-generates ID
    return { ...data, id: docRef.id };
  }

  async findAll(): Promise<Fiction[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Fiction));
  }

  async findById(id: string): Promise<Fiction | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Fiction) : null;
  }

  async update(id: string, data: Partial<Fiction>): Promise<Fiction | null> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    await docRef.update(data);
    return { id: doc.id, ...doc.data(), ...data } as Fiction;
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
