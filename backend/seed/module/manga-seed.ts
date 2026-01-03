import { seedCollection } from "../seed-helper.js";

export async function seedManga() {
  console.log("📦 Seeding Manga...");

  const count = await seedCollection({
    collectionName: "manga",
    dataFile: "manga.json",
    defaults: {
      chapters: 0,
      volumes: 0,
      status: "Plan to Read",
    },
  });

  console.log(`✨ Manga seeded: ${count} documents`);
}
