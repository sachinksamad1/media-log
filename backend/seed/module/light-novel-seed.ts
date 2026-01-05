import { seedCollectionWithSchema } from "../seed-helper.js";
import { LightNovelSchema } from "../../src/modules/light-novel/light-novel.schema.js";

export async function seedLightNovel() {
  console.log("📦 Seeding Light Novels...");

  const count = await seedCollectionWithSchema({
    collectionName: "light_novel",
    dataFile: "../data/light-novel.json",
    schema: LightNovelSchema,
    defaults: {
      userStats: {
        score: 0,
        currentReadingVolume: 0,
        readingStatus: "Planned"
      }
    }
  });

  console.log(`✨ Light Novels seeded: ${count} documents`);
}
