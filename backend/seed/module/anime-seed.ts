// backend/seed/module/anime-seed.ts
import { seedCollectionWithSchema } from "../seed-helper.js";
import { AnimeSchema } from "../../src/modules/anime/anime-schema.js";

export async function seedAnime() {
  console.log("📦 Seeding Anime...");

  const count = await seedCollectionWithSchema({
    collectionName: "anime",
    dataFile: "../data/anime.json",
    schema: AnimeSchema,
    defaults: {
      animeStats: {
        currentSeason: 0,
        totalSeasons: 1,
        isCompleted: false,
      },
      userStats: {
        score: 0,
        status: "Planned",
      },
    },
  });

  console.log(`✨ Anime seeded: ${count} documents`);
}
