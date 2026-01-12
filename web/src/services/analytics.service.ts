import { http } from '@/services/http';
import type { DashboardStats } from '@/types/dashboard';

export class AnalyticsService {
  static async getDashboardStats(): Promise<DashboardStats> {
    return http.get('/analytics/dashboard');
  }
}
