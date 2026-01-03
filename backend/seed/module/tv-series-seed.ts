import { seedCollection } from "../seed-helper.js";

export async function seedTVSeries() {
  console.log("📦 Seeding TV Series...");

  const count = await seedCollection({
    collectionName: "tv_series",
    dataFile: "tv-series.json",
    defaults: {
      seasons: 0,
      episodes: 0,
      status: "Planned",
    },
  });

  console.log(`✨ TV Series seeded: ${count} documents`);
}
