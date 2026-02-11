import { test as base, expect, request } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

/**
 * Custom test fixtures for the Media Log Backend
 * Extends Playwright's base test with custom properties and utilities
 */

// Define custom fixture types
interface CustomFixtures {
  /** Pre-authenticated API context */
  authenticatedRequest: APIRequestContext;
  /** Test data helpers */
  testData: TestDataHelper;
}

interface TestDataHelper {
  /** Generate a unique email for testing */
  uniqueEmail: () => string;
  /** Generate a unique username */
  uniqueUsername: () => string;
  /** Get current timestamp */
  timestamp: () => number;
}

/**
 * Extended test with custom fixtures
 */
export const test = base.extend<CustomFixtures>({
  // Authenticated API request context
  authenticatedRequest: async ({ baseURL }, use) => {
    const context = await request.newContext({
      baseURL: baseURL || 'http://localhost:3001/api', // Updated default
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        // Use test token to bypass Firebase Auth in test env
        Authorization: 'Bearer test-token-123',
      },
    });

    await use(context);
    await context.dispose();
  },

  // Test data helpers
  // eslint-disable-next-line no-empty-pattern
  testData: async ({}, use) => {
    const helper: TestDataHelper = {
      uniqueEmail: () =>
        `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
      uniqueUsername: () =>
        `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: () => Date.now(),
    };

    await use(helper);
  },
});

export { expect };

/**
 * Common API response expectations
 */
export const apiExpect = {
  /** Expect a successful response (2xx) */
  toBeSuccessful: (response: { ok: () => boolean; status: () => number }) => {
    expect(
      response.ok(),
      `Expected successful response, got ${response.status()}`,
    ).toBeTruthy();
  },

  /** Expect a specific status code */
  toHaveStatus: (
    response: { status: () => number },
    expectedStatus: number,
  ) => {
    expect(response.status()).toBe(expectedStatus);
  },

  /** Expect JSON response with specific structure */
  toHaveJsonBody: async <T>(response: {
    json: () => Promise<T>;
  }): Promise<T> => {
    const body = await response.json();
    expect(body).toBeDefined();
    return body;
  },
};
