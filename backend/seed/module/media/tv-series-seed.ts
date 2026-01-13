import { TvSeriesSchema } from '../../../src/modules/media/tv-series/tv-series-schema.js';
import { seedCollectionWithSchema } from '../../seed-helper.js';


export async function seedTVSeries() {
  console.log('📦 Seeding TV Series...');

  const count = await seedCollectionWithSchema({
    collectionName: 'tv_series',
    dataFile: '../data/tv-series.json',
    schema: TvSeriesSchema,
    defaults: {
      userStats: {
        score: 5,
        status: 'Planned',
      },
    },
  });

  console.log(`✨ TV Series seeded: ${count} documents`);
}
