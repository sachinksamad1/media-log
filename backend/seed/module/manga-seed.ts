import { seedCollectionWithSchema } from "../seed-helper.js";
import { MangaSchema } from "../../src/modules/manga/manga-schema.js";

export async function seedManga() {
  console.log("📦 Seeding Manga...");

  const count = await seedCollectionWithSchema({
    collectionName: "manga",
    dataFile: "manga.json",
    schema: MangaSchema,
    defaults: {
      userStats: {
        score: 5,
        currentChapter: 1,
        currentVolume: 1,
        readingStatus: "Planned"
      }
    }
  });

  console.log(`✨ Manga seeded: ${count} documents`);
}
