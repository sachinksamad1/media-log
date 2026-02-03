// import { seedAnime } from './module/anime-seed.js';
// import { seedFiction } from './module/fiction-seed.js';
// import { seedGame } from './module/game-seed.js';
// import { seedLightNovel } from './module/light-novel-seed.js';
// import { seedManga } from './module/manga-seed.js';
// import { seedMovies } from './module/movies-seed.js';
// import { seedNonFiction } from './module/non-fiction-seed.js';
// import { seedTVSeries } from './module/tv-series-seed.js';

// async function runSeeds() {
//   try {
//     // eslint-disable-next-line no-console
//     console.log('🚀 Starting Firestore Seeding...');

//     await seedAnime();
//     await seedFiction();
//     await seedGame();
//     await seedLightNovel();
//     await seedManga();
//     await seedMovies();
//     await seedNonFiction();
//     await seedTVSeries();

//     // eslint-disable-next-line no-console
//     console.log('✅ All collections seeded successfully');
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error('❌ Seeding failed:', error);
//     throw error;
//   }
// }

// runSeeds().catch(() => {
//   process.exitCode = 1;
// });
