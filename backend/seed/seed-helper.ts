import * as fs from "fs";
import * as path from "path";
import { db } from "./firebase";

interface SeedOptions {
  collectionName: string;
  dataFile: string;
  defaults?: Record<string, any>;
}

export async function seedCollection({
  collectionName,
  dataFile,
  defaults = {},
}: SeedOptions): Promise<number> {
  const dataPath = path.join(__dirname, "data", dataFile);

  if (!fs.existsSync(dataPath)) {
    throw new Error(`Data file not found: ${dataPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const batch = db.batch();
  const collectionRef = db.collection(collectionName);

  let count = 0;

  for (const item of rawData) {
    const docRef = collectionRef.doc();

    batch.set(docRef, {
      ...defaults,
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    count++;
  }

  await batch.commit();
  return count;
}
