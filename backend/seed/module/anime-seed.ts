// backend/seed/module/anime-seed.ts
import { seedCollectionWithSchema } from "../seed-helper.js";
import { AnimeSchema } from "../../src/modules/media/anime/anime-schema.js";

export async function seedAnime() {
  console.log("📦 Seeding Anime...");

  const count = await seedCollectionWithSchema({
    collectionName: "anime",
    dataFile: "../data/anime.json",
    schema: AnimeSchema,
    defaults: {
      releaseStats: {
        totalSeasons: 1,
        isCompleted: false,
      },
      userStats: {
        score: 5,
        status: "Planned",
      },
    },
  });

  console.log(`✨ Anime seeded: ${count} documents`);
}
