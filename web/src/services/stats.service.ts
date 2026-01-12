import { http } from "./http"
import type { StatsResponse } from "../types/stats"

export const StatsService = {
  async getLibraryStats(): Promise<StatsResponse> {
    return await http.get<StatsResponse>(
      "/dashboard/library-summary"
    ) as unknown as StatsResponse
  }
}
