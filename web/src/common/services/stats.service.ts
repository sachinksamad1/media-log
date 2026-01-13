import http from "@api/http";
import type { StatsResponse } from "@common/types/stats";

export const StatsService = {
  async getLibraryStats(): Promise<StatsResponse> {
    const response = await http.get<StatsResponse>("/dashboard/library-summary");
    return response.data;
  },
};
