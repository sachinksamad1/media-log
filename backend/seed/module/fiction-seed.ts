import { seedCollection } from "../seed-helper.js";

export async function seedFiction() {
  console.log("📦 Seeding Fiction...");

  const count = await seedCollection({
    collectionName: "fiction",
    dataFile: "./data/fiction.json",
    defaults: {
      pages: 0,
      status: "Plan to Read",
    },
  });

  console.log(`✨ Fiction seeded: ${count} documents`);
}
