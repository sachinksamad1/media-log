import { seedCollection } from "../seed-helper.js";

export async function seedAnime() {
  console.log("📦 Seeding Anime...");

  const count = await seedCollection({
    collectionName: "anime",
    dataFile: "./data/anime.json",
    defaults: {
      episodes: 0,
      score: 0,
      status: "Plan to Watch",
    },
  });

  console.log(`✨ Anime seeded: ${count} documents`);
}
