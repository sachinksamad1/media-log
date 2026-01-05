import { BaseService } from "@/common/base/base-service.js";
import { GameRepository } from "./games-reop.js";
import { Games } from "./games-schema.js";

export class GamesService extends BaseService<Games> {
    constructor() {
        super(new GameRepository());
    }

    // Mark as Game completed
    async completeGame(id: string, score: number = 7) {
        // Logic: Set completedAt to now, score to 7
        return await this.update(id, {
            userStats: {
                score: score,
                playStatus: "Completed"
            }
        })
    }
}