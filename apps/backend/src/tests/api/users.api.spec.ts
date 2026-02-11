import { test, expect, apiExpect } from '../fixtures/base.fixture.js';

test.describe('Users API', () => {
  // Use serial mode to avoid race conditions on the single test user
  test.describe.configure({ mode: 'serial' });

  const testUser = {
    username: 'test_user_api',
    // email matches the one in auth-middleware bypass
    email: 'test@example.com',
  };

  test('POST /api/users/sync - should create/sync test user', async ({
    authenticatedRequest,
  }) => {
    const response = await authenticatedRequest.post('/api/users/sync', {
      data: {
        username: testUser.username,
        displayName: 'Test User API',
      },
    });

    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(body.data).toHaveProperty('uid', 'test-user-id');
    expect(body.data).toHaveProperty('email', testUser.email);
  });

  test('GET /api/users/me - should get current user profile', async ({
    authenticatedRequest,
  }) => {
    const response = await authenticatedRequest.get('/api/users/me');

    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(body.data).toHaveProperty('uid', 'test-user-id');
  });

  test('PATCH /api/users/me - should update user profile', async ({
    authenticatedRequest,
  }) => {
    const newDisplayName = 'Updated Test User';
    const response = await authenticatedRequest.patch('/api/users/me', {
      data: {
        displayName: newDisplayName,
      },
    });

    apiExpect.toBeSuccessful(response);
    const body = await response.json();
    expect(body.data).toHaveProperty('displayName', newDisplayName);
  });

  // Test public endpoint (unauthenticated)
  test('POST /api/users/recover/username - should validate request', async ({
    request,
  }) => {
    // Missing email
    const response = await request.post('/api/users/recover/username', {
      data: {},
    });

    expect(response.status()).toBe(400); // Bad Request
  });
});
