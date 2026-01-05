import { seedCollectionWithSchema } from "../seed-helper.js";
import { GameSchema } from "../../src/modules/games/games-schema.js";

export async function seedGames() {
  console.log("📦 Seeding Games...");

  const count = await seedCollectionWithSchema({
    collectionName: "games",
    dataFile: "../data/games.json",
    schema: GameSchema,
    defaults: {
      userStats: {
        score: 0,
        playStatus: "Planned",
      },
      publicationStatus: "Released",
    },
  });

  console.log(`✨ Games seeded: ${count} documents`);
}
