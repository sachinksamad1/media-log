import { FictionSchema } from '../../../src/modules/media/fiction/fiction-schema.js';
import { seedCollectionWithSchema } from '../../seed-helper.js';


export async function seedFiction() {
  console.log('📦 Seeding Fiction...');

  const count = await seedCollectionWithSchema({
    collectionName: 'fiction',
    dataFile: '../data/fiction.json',
    schema: FictionSchema,
    defaults: {},
  });

  console.log(`✨ Fiction seeded: ${count} documents`);
}
