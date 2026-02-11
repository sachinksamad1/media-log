import { test, expect, apiExpect } from '../fixtures/base.fixture.js';

test.describe('Dashboard & Analytics API', () => {
  test.beforeAll(async ({ authenticatedRequest }) => {
    // Ensure test user exists
    await authenticatedRequest.post('/api/users/sync', {
      data: {
        username: 'test_user_analytics',
        displayName: 'Test User Analytics',
      },
    });
  });

  test('GET /api/dashboard/library-summary', async ({
    authenticatedRequest,
  }) => {
    const response = await authenticatedRequest.get(
      '/api/dashboard/library-summary',
    );
    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(typeof body.data).toBe('object');
  });

  test('GET /api/stats/summary', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get('/api/stats/summary');
    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(body.data).toBeDefined();
  });

  test('GET /api/reports', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get('/api/reports');
    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data).toHaveProperty('items');
    expect(Array.isArray(body.data.items)).toBeTruthy();
  });

  test('GET /api/reports/summary', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get('/api/reports/summary');
    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(body.data).toBeDefined();
  });

  test('GET /api/user-activity', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get('/api/user-activity');
    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBeTruthy();
  });
});
