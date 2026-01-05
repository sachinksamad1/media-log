import { seedCollectionWithSchema } from "../seed-helper.js";
import { GameSchema } from "../../src/modules/game/game-schema.js";

export async function seedGame() {
  console.log("📦 Seeding Games...");

  const count = await seedCollectionWithSchema({
    collectionName: "game",
    dataFile: "../data/game.json",
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


