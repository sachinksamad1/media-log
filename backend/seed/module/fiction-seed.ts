import { seedCollectionWithSchema } from "../seed-helper.js";
import { FictionSchema } from "../../src/modules/fiction/fiction-schema.js";

export async function seedFiction() {
  console.log("📦 Seeding Fiction...");

  const count = await seedCollectionWithSchema({
    collectionName: "fiction",
    dataFile: "../data/fiction.json",
    schema: FictionSchema,
    defaults: {
      publicationStatus: "Completed",
      readingStatus: "Planned",
    },
  });

  console.log(`✨ Fiction seeded: ${count} documents`);
}
