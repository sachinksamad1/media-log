import { db } from '@config/firebase.js';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

import { RecommendationsService } from '../../modules/recommendations/recommendations-service.js';

vi.mock('@config/firebase.js', () => ({
  db: {
    collection: vi.fn(),
  },
}));

// Define types for mocks to avoid 'any' linting errors
type MockDoc = {
  id: string;
  data: () => Record<string, unknown>;
};

type MockSnapshot = {
  forEach: (cb: (doc: MockDoc) => void) => void;
  empty: boolean;
};

describe('RecommendationsService', () => {
  let service: RecommendationsService;

  beforeEach(() => {
    service = new RecommendationsService();
    vi.clearAllMocks();
  });

  const createMockSnapshot = (
    docs: Array<{ id: string; data: Record<string, unknown> }>,
  ): MockSnapshot => ({
    forEach: (cb: (doc: MockDoc) => void) => {
      docs.forEach((d) => cb({ id: d.id, data: () => d.data }));
    },
    empty: docs.length === 0,
  });

  it('should return fallback recommendations if user has no highly rated items', async () => {
    // User has media items but none are highly rated (score < 7)
    const mockUserMediaDocs = [
      {
        id: '1',
        data: {
          userId: 'user1',
          title: 'Planned Item',
          userStats: { score: 0, status: 'Planned' },
          genres: ['Action'],
        },
      },
      {
        id: '2',
        data: {
          userId: 'user1',
          title: 'Low Score Item',
          userStats: { score: 4, status: 'On-Hold' },
          genres: ['Drama'],
        },
      },
    ];

    const mockSnapshot = createMockSnapshot(mockUserMediaDocs);
    const mockWhere = vi.fn().mockReturnThis();
    const mockGet = vi.fn().mockResolvedValue(mockSnapshot);

    (db.collection as Mock).mockReturnValue({
      where: mockWhere,
      get: mockGet,
    });

    const recommendations = await service.getRecommendations('user1', 5);

    // Should return fallback recommendations (the user's own backlog)
    expect(recommendations.length).toBe(2);
    expect(recommendations[0]?.title).toBe('Planned Item');
    expect(recommendations[0]?.score).toBe(0.1);
  });

  it('should return content-based recommendations based on genres from own backlog', async () => {
    // User has one liked item (Seed) and one planned item (Candidate)
    const mockUserMediaDocs = [
      {
        id: '1',
        data: {
          userId: 'user1',
          title: 'Liked Action Anime',
          genres: ['Action', 'Sci-Fi'],
          userStats: { score: 9, status: 'Completed' },
        },
      },
      {
        id: '2',
        data: {
          userId: 'user1',
          title: 'Target Action Anime',
          genres: ['Action'],
          userStats: { score: 0, status: 'Planned' },
        },
      },
      {
        id: '3',
        data: {
          userId: 'user1',
          title: 'Unrelated Romance',
          genres: ['Romance'],
          userStats: { score: 0, status: 'Planned' },
        },
      },
    ];

    const mockSnapshot = createMockSnapshot(mockUserMediaDocs);
    const mockWhere = vi.fn().mockReturnThis();
    const mockGet = vi.fn().mockResolvedValue(mockSnapshot);

    (db.collection as Mock).mockReturnValue({
      where: mockWhere,
      get: mockGet,
    });

    const recommendations = await service.getRecommendations('user1', 2);

    // Should return "Target Action Anime" as the top recommendation
    expect(recommendations.length).toBe(2);
    expect(recommendations[0]?.title).toBe('Target Action Anime');
    expect(recommendations[0]!.score).toBeGreaterThan(
      recommendations[1]!.score,
    );
  });

  it('should handle empty user media gracefully', async () => {
    const mockSnapshot = createMockSnapshot([]);
    const mockWhere = vi.fn().mockReturnThis();
    const mockGet = vi.fn().mockResolvedValue(mockSnapshot);

    (db.collection as Mock).mockReturnValue({
      where: mockWhere,
      get: mockGet,
    });

    const recommendations = await service.getRecommendations('user1', 5);
    expect(recommendations.length).toBe(0);
  });

  it('should categorize items correctly into seeds and candidates', async () => {
    const mockUserMediaDocs = [
      {
        id: '1',
        data: {
          userId: 'user1',
          title: 'Seed 1',
          genres: ['Action'],
          userStats: { score: 8, status: 'Completed' },
        },
      },
      {
        id: '2',
        data: {
          userId: 'user1',
          title: 'Seed 2',
          genres: ['Action'],
          userStats: { score: 10, status: 'Watching' },
        },
      },
      {
        id: '3',
        data: {
          userId: 'user1',
          title: 'Candidate',
          genres: ['Action'],
          userStats: { score: 0, status: 'Planned' },
        },
      },
    ];

    const mockSnapshot = createMockSnapshot(mockUserMediaDocs);
    const mockWhere = vi.fn().mockReturnThis();
    const mockGet = vi.fn().mockResolvedValue(mockSnapshot);

    (db.collection as Mock).mockReturnValue({
      where: mockWhere,
      get: mockGet,
    });

    const recommendations = await service.getRecommendations('user1', 5);

    // Only "Candidate" should be returned as a recommendation
    expect(recommendations.length).toBe(1);
    expect(recommendations[0]?.title).toBe('Candidate');
  });
});
