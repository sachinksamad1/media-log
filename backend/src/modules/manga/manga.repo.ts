import { db } from "../../config/firebase.js";
import { Manga } from "./manga.schema.js";

export class MangaRepository {
  private collection = db.collection("manga");

  // CREATE, new entry
  async create(data: Manga): Promise<Manga> {
    const docRef = await this.collection.add(data); // Auto-generates ID
    return { ...data, id: docRef.id };
  }

  // READ, get all entries
  async findAll(): Promise<Manga[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Manga));
  }

  // READ, get entry by ID
  async findById(id: string): Promise<Manga | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Manga) : null;
  }

  // UPDATE, update entry
  async update(id: string, data: Partial<Manga>): Promise<Manga | null> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    await docRef.update(data);
    return { id: doc.id, ...doc.data(), ...data } as Manga;
  }

  // DELETE, delete entry
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
