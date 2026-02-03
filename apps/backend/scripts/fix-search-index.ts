import { db } from '../src/config/firebase.js';

/* eslint-disable no-console */

const COLLECTIONS = [
  'anime',
  'manga',
  'movie',
  'game',
  'light_novel',
  'tv_series',
  'fiction',
  'non_fiction',
];

// Helper to generate keywords (copied from MediaRepository)
function generateSearchKeywords(title: string): string[] {
  if (!title) return [];

  const words = title.toLowerCase().split(/\s+/);
  const keywords = new Set<string>();

  words.forEach((word) => {
    // Generate all prefixes for each word
    let current = '';
    for (const char of word) {
      current += char;
      keywords.add(current);
    }
  });

  return Array.from(keywords);
}

async function migrateCollection(collectionName: string) {
  console.log(`Starting migration for collection: ${collectionName}`);
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log(`No documents found in ${collectionName}`);
    return;
  }

  let updatedCount = 0;
  const batchSize = 500;
  let batch = db.batch();
  let operationCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const title = data.title;

    if (title && typeof title === 'string') {
      const titleLower = title.toLowerCase();
      const searchKeywords = generateSearchKeywords(title);

      const updateData = {
        titleLower,
        searchKeywords,
      };

      batch.update(doc.ref, updateData);
      operationCount++;
      updatedCount++;

      if (operationCount >= batchSize) {
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
        console.log(
          `Committed batch of ${batchSize} updates for ${collectionName}`,
        );
      }
    }
  }

  if (operationCount > 0) {
    await batch.commit();
    console.log(
      `Committed final batch of ${operationCount} updates for ${collectionName}`,
    );
  }

  console.log(`Finished ${collectionName}: Updated ${updatedCount} documents.`);
}

async function runMigration() {
  try {
    console.log('Starting Search Index Migration...');

    for (const name of COLLECTIONS) {
      await migrateCollection(name);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

runMigration().catch((err) => {
  console.error('Unhandled error:', err);
  throw err;
});
