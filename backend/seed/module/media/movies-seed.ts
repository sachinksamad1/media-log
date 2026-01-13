import { MovieSchema } from '../../../src/modules/media/movie/movie-schema.js';
import { seedCollectionWithSchema } from '../../seed-helper.js';

export async function seedMovies() {
  console.log('📦 Seeding Movies...');

  const count = await seedCollectionWithSchema({
    collectionName: 'movie',
    dataFile: '../data/movie.json',
    schema: MovieSchema,
    defaults: {
      userStats: {
        score: 5,
        status: 'Planned',
      },
    },
  });

  console.log(`✨ Movies seeded: ${count} documents`);
}
