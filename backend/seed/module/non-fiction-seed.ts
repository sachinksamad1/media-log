import { seedCollection } from "../seed-helper.js";

export async function seedNonFiction() {
  console.log("📦 Seeding Non-Fiction...");

  const count = await seedCollection({
    collectionName: "non_fiction",
    dataFile: "non-fiction.json",
    defaults: {
      pages: 0,
      category: "General",
      status: "Plan to Read",
    },
  });

  console.log(`✨ Non-Fiction seeded: ${count} documents`);
}
