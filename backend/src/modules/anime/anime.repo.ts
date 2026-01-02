import { db } from "../../config/firebase.js";
import { Anime } from "./anime.schema.js";

export class AnimeRepository {
  private collection = db.collection("anime");

  async create(data: Anime): Promise<Anime> {
    const docRef = await this.collection.add(data); // Auto-generates ID
    return { ...data, id: docRef.id };
  }

  async findAll(): Promise<Anime[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Anime));
  }

  async findById(id: string): Promise<Anime | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Anime) : null;
  }

  async update(id: string, data: Partial<Anime>): Promise<Anime | null> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    await docRef.update(data);
    return { id: doc.id, ...doc.data(), ...data } as Anime;
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
