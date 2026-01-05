// backend/seed/seed-helper.ts
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { ZodSchema } from "zod";
import { db } from "./firebase";

// ESM-compatible __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SeedOptions<T> {
  collectionName: string;
  dataFile: string;
  schema: ZodSchema<T>;
  defaults?: Partial<T>;
}

export async function seedCollectionWithSchema<T>({
  collectionName,
  dataFile,
  schema,
  defaults = {},
}: SeedOptions<T>): Promise<number> {
  const dataPath = path.join(__dirname, "data", dataFile);

  if (!fs.existsSync(dataPath)) {
    throw new Error(`❌ Data file not found: ${dataPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const batch = db.batch();
  const collectionRef = db.collection(collectionName);

  let count = 0;

  for (const [index, item] of rawData.entries()) {
    const parsed = schema.safeParse({
      ...defaults,
      ...item,
    });

    if (!parsed.success) {
      console.error(`❌ Validation failed at index ${index}`);
      console.error(parsed.error.format());
      throw new Error(`Seed validation failed for ${collectionName}`);
    }

    const docRef = collectionRef.doc();

    batch.set(docRef, {
      ...parsed.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    count++;
  }

  await batch.commit();
  return count;
}
