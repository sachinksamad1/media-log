import { seedCollection } from "../seed-helper.js";

export async function seedMovies() {
  console.log("📦 Seeding Movies...");

  const count = await seedCollection({
    collectionName: "movies",
    dataFile: "movies.json",
    defaults: {
      durationMinutes: 0,
      status: "Planned",
    },
  });

  console.log(`✨ Movies seeded: ${count} documents`);
}
