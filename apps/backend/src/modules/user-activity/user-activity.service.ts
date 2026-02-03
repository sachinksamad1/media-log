import { UserActivityRepository } from './user-activity.repo.js';
import type { UserActivity } from './user-activity.schema.js';

export class UserActivityService {
  private repository: UserActivityRepository;

  constructor() {
    this.repository = new UserActivityRepository();
  }

  async logActivity(
    userId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'COMPLETE',
    resourceType: string,
    resourceId: string,
    resourceTitle?: string,
    details?: string,
  ) {
    const activity: UserActivity = {
      userId,
      action,
      resourceType,
      resourceId,
      resourceTitle,
      details,
      createdAt: new Date(),
    };

    await this.repository.create(activity);
  }

  async getRecentActivities(userId: string, limit: number = 20) {
    return this.repository.getRecent(userId, limit);
  }
}

// Export singleton instance for easy usage across services
export const userActivityService = new UserActivityService();
