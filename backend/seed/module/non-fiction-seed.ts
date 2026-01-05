import { seedCollectionWithSchema } from "../seed-helper.js";
import { NonFictionSchema } from "../../src/modules/non-fiction/non-fiction-schema.js";

export async function seedNonFiction() {
  console.log("📦 Seeding Non-Fiction...");

  const count = await seedCollectionWithSchema({
    collectionName: "non_fiction",
    dataFile: "non-fiction.json",
    schema: NonFictionSchema,
    defaults: {
      readingStatus: "Planned",
    },
  });

  console.log(`✨ Non-Fiction seeded: ${count} documents`);
}
