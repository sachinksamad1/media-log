import { test, expect, apiExpect } from '../fixtures/base.fixture.js';

test.describe('Media API (Anime)', () => {
  // Use serial mode for stateful CRUD
  test.describe.configure({ mode: 'serial' });

  let animeId: string;

  test.beforeAll(async ({ authenticatedRequest }) => {
    // Ensure test user exists
    await authenticatedRequest.post('/api/users/sync', {
      data: {
        username: 'test_media_user',
        displayName: 'Test Media User',
      },
    });
  });

  test('POST /api/anime - should create new anime', async ({
    authenticatedRequest,
  }) => {
    const newAnime = {
      title: 'Test Anime Series',
      genres: ['Action', 'Adventure'],
      userStats: {
        score: 8,
        status: 'Watching',
      },
      releaseStats: {
        totalEpisodes: 24,
        isCompleted: false,
      },
    };

    const response = await authenticatedRequest.post('/api/anime', {
      data: newAnime,
    });

    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(body.data).toHaveProperty('id');
    expect(body.data.title).toBe(newAnime.title);

    animeId = body.data.id;
  });

  test('GET /api/anime - should list anime', async ({
    authenticatedRequest,
  }) => {
    const response = await authenticatedRequest.get('/api/anime');
    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(
      body.data.some((item: { id: string }) => item.id === animeId),
    ).toBeTruthy();
  });

  test('GET /api/anime/:id - should get anime details', async ({
    authenticatedRequest,
  }) => {
    const response = await authenticatedRequest.get(`/api/anime/${animeId}`);
    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(body.data.id).toBe(animeId);
  });

  test('PATCH /api/anime/:id - should update anime', async ({
    authenticatedRequest,
  }) => {
    const updateData = {
      title: 'Updated Anime Title',
      userStats: {
        score: 9,
        status: 'Completed',
      },
    };

    const response = await authenticatedRequest.patch(`/api/anime/${animeId}`, {
      data: updateData,
    });

    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(body.data.title).toBe(updateData.title);
    expect(body.data.userStats.score).toBe(9);
  });

  test('DELETE /api/anime/:id - should delete anime', async ({
    authenticatedRequest,
  }) => {
    const response = await authenticatedRequest.delete(`/api/anime/${animeId}`);
    apiExpect.toBeSuccessful(response);

    // Verify deletion
    const getResponse = await authenticatedRequest.get(`/api/anime/${animeId}`);
    expect(getResponse.status()).toBe(404);
  });
});

test.describe('Media API (Routing Checks)', () => {
  const mediaTypes = [
    'manga',
    'fiction',
    'games',
    'light-novel',
    'movie',
    'non-fiction',
    'tv-series',
  ];

  for (const type of mediaTypes) {
    test(`GET /api/${type} - should handle valid route`, async ({
      authenticatedRequest,
    }) => {
      const response = await authenticatedRequest.get(`/api/${type}`);
      // Should be 200 OK (empty list) or at least 401 if auth fails (but we are authed)
      // 404 would mean route doesn't exist
      expect(response.status()).not.toBe(404);
      expect(response.status()).toBeLessThan(500);
    });
  }
});
