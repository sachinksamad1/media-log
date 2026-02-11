import { test, expect, apiExpect } from '../fixtures/base.fixture.js';

test.describe('Search API', () => {
  test('GET /api/search - with valid query', async ({
    authenticatedRequest,
  }) => {
    const query = 'naruto';
    const response = await authenticatedRequest.get(
      `/api/search?query=${query}`,
    );

    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(body.data).toBeDefined();
  });

  test('GET /api/search - without query parameter', async ({
    authenticatedRequest,
  }) => {
    const response = await authenticatedRequest.get('/api/search');
    // It might return 200 with empty data or 400 depending on implementation
    // Assuming backend returns 200 or 400, verify it is not 404 or 500
    expect(response.status()).toBeLessThan(500);
    expect(response.status()).not.toBe(404);
  });

  test('GET /api/search - pagination', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get(
      '/api/search?query=naruto&page=1',
    );
    apiExpect.toBeSuccessful(response);
  });
});
