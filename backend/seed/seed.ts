import { seedAnime } from './module/anime-seed.js';
import { seedManga } from './module/manga-seed.js';
import { seedLightNovel } from './module/light-novel-seed.js';
import { seedMovies } from './module/movies-seed.js';
import { seedTVSeries } from './module/tv-series-seed.js';
import { seedFiction } from './module/fiction-seed.js';
import { seedGame } from './module/game-seed.js';
import { seedNonFiction } from './module/non-fiction-seed.js';

async function runSeeds() {
  try {
    console.log('🚀 Starting Firestore Seeding...');

    // await seedAnime();
    await seedFiction();
    // await seedGame();
    // await seedLightNovel();
    // await seedManga();
    // await seedMovies();
    // await seedNonFiction();
    // await seedTVSeries();

    console.log('✅ All collections seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeds();
