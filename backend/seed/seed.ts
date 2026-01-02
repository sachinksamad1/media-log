import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { AnimeSchema } from '../src/modules/anime/anime.schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = new URL('../serviceAccountKey.json', import.meta.url);
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function runSeed() {
  try {
    console.log("🚀 Starting Data Seed...");
    
    // Load your data.json
    const dataPath = path.join(__dirname, "./data/anime.json");
    const rawData = JSON.parse(readFileSync(dataPath, "utf8"));

    const batch = db.batch();
    const collectionRef = db.collection("anime");

    for (const item of rawData) {
      // Validate with Zod to ensure data matches your Alpha schema
      const validatedData = AnimeSchema.parse({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newDocRef = collectionRef.doc(); 
      batch.set(newDocRef, validatedData);
      console.log(`✅ Prepared: ${validatedData.title}`);
    }

    await batch.commit();
    console.log("✨ Database successfully seeded!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

runSeed();