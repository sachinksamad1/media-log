import { seedCollection } from "../seed-helper.js";

export async function seedLightNovels() {
  console.log("📦 Seeding Light Novels...");

  const count = await seedCollection({
    collectionName: "light_novels",
    dataFile: "../data/light-novel.json",
    defaults: {
      volumes: 0,
      status: "Plan to Read",
    },
  });

  console.log(`✨ Light Novels seeded: ${count} documents`);
}
