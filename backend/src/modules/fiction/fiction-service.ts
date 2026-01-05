import { BaseService } from "../../common/base/base-service.js";
import { FictionRepository } from "./fiction-repo.js";
import { Fiction } from "./fiction-schema.js";

export class FictionService extends BaseService<Fiction> {
  constructor() {
    super(new FictionRepository());
  }

  // Mark as completed
  async completeSeries(id: string, score: number = 7) {
    // Logic: Set status to Completed and score to the provided value
    return await this.update(id, {
      readingStatus: "Completed",
      score,
    });
  }
}
