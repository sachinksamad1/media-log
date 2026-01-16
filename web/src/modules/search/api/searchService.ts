import http from "@/common/api/http";
import type { GlobalSearchResponse } from "../types";

export const searchService = {
  async search(query: string, type?: string): Promise<GlobalSearchResponse[]> {
    const params = new URLSearchParams();
    params.append("query", query);
    if (type) params.append("type", type);

    const response = await http.get<{ data: GlobalSearchResponse[] }>(
      `/search?${params.toString()}`
    );
    return response.data.data;
  },
};
