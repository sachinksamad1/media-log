import type { APIRequestContext } from '@playwright/test';

/**
 * API Client utility for common API operations
 * Provides typed methods for interacting with the Media Log API
 */
export class ApiClient {
  constructor(private request: APIRequestContext) {}

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options?: { headers?: Record<string, string> }): Promise<{
    status: number;
    data: T;
    ok: boolean;
  }> {
    const response = await this.request.get(endpoint, {
      headers: options?.headers,
    });

    return {
      status: response.status(),
      data: await response.json(),
      ok: response.ok(),
    };
  }

  /**
   * Make a POST request
   */
  async post<T, D = unknown>(
    endpoint: string,
    data: D,
    options?: { headers?: Record<string, string> }
  ): Promise<{
    status: number;
    data: T;
    ok: boolean;
  }> {
    const response = await this.request.post(endpoint, {
      data,
      headers: options?.headers,
    });

    return {
      status: response.status(),
      data: await response.json(),
      ok: response.ok(),
    };
  }

  /**
   * Make a PUT request
   */
  async put<T, D = unknown>(
    endpoint: string,
    data: D,
    options?: { headers?: Record<string, string> }
  ): Promise<{
    status: number;
    data: T;
    ok: boolean;
  }> {
    const response = await this.request.put(endpoint, {
      data,
      headers: options?.headers,
    });

    return {
      status: response.status(),
      data: await response.json(),
      ok: response.ok(),
    };
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options?: { headers?: Record<string, string> }): Promise<{
    status: number;
    data: T;
    ok: boolean;
  }> {
    const response = await this.request.delete(endpoint, {
      headers: options?.headers,
    });

    return {
      status: response.status(),
      data: await response.json(),
      ok: response.ok(),
    };
  }

  /**
   * Make a PATCH request
   */
  async patch<T, D = unknown>(
    endpoint: string,
    data: D,
    options?: { headers?: Record<string, string> }
  ): Promise<{
    status: number;
    data: T;
    ok: boolean;
  }> {
    const response = await this.request.patch(endpoint, {
      data,
      headers: options?.headers,
    });

    return {
      status: response.status(),
      data: await response.json(),
      ok: response.ok(),
    };
  }
}

/**
 * Create an API client from a Playwright request context
 */
export function createApiClient(request: APIRequestContext): ApiClient {
  return new ApiClient(request);
}
