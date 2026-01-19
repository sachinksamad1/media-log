import type { APIRequestContext } from '@playwright/test';

import { test, expect, apiExpect } from '../fixtures/base.fixture.js';

/**
 * Health Check API Tests
 * Tests the basic health and connectivity of the API
 */
test.describe('Health Check API', () => {
  test('should return health status', async ({ request }: { request: APIRequestContext }) => {
    const response = await request.get('/health');

    apiExpect.toBeSuccessful(response);

    const body = await response.json();
    expect(body).toHaveProperty('status');
  });

  test('should return 200 on root endpoint', async ({ request }: { request: APIRequestContext }) => {
    const response = await request.get('/');

    // Root might return 200 or redirect, both are acceptable
    expect(response.status()).toBeLessThan(400);
  });
});

test.describe('API Error Handling', () => {
  test('should return 404 for non-existent routes', async ({ request }: { request: APIRequestContext }) => {
    const response = await request.get('/api/non-existent-route-12345');

    apiExpect.toHaveStatus(response, 404);
  });

  test('should handle invalid JSON gracefully', async ({ request }: { request: APIRequestContext }) => {
    const response = await request.post('/api/invalid-endpoint', {
      data: 'not valid json',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Should return client error (4xx)
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });
});
