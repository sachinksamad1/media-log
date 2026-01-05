import { seedAnime } from "./module/anime-seed.js";
import { seedManga } from "./module/manga-seed.js";
import { seedLightNovels } from "./module/light-novel-seed.js";
import { seedMovies } from "./module/movies-seed.js";
import { seedTVSeries } from "./module/tv-series-seed.js";
import { seedFiction } from "./module/fiction-seed.js";
import { seedGames } from "./module/games-seed.js";
import { seedNonFiction } from "./module/non-fiction-seed.js";

async function runSeeds() {
  try {
    console.log("🚀 Starting Firestore Seeding...");

    // await seedAnime();
    // await seedFiction();
    await seedGames();
    // await seedManga();
    // await seedLightNovels();
    // await seedMovies();
    // await seedTVSeries();
    // await seedNonFiction();

    console.log("✅ All collections seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

runSeeds();
