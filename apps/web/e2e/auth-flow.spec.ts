import { test, expect } from '@playwright/test'

/**
 * Authentication E2E Tests (Mocked)
 *
 * Simulates user login and signup flows by mocking Firebase Auth network requests
 * and backend API responses. This avoids needing real Firebase credentials
 * or a running backend for UI testing.
 */

test.describe('Authentication Flow', () => {
  // Mock API Responses
  const MOCK_USER = {
    localId: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    idToken: 'mock-id-token-123',
    refreshToken: 'mock-refresh-token-456',
    expiresIn: '3600',
  }

  const MOCK_BACKEND_USER = {
    uid: 'test-user-id',
    email: 'test@example.com',
    username: 'TestUser',
    displayName: 'Test User',
    preferences: { theme: 'dark' },
  }

  test.beforeEach(async ({ page }) => {
    // 1. Mock Firebase Auth (Identity Toolkit)
    // Intercepts login requests
    await page.route(
      '**/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword**',
      async (route) => {
        const json = {
          kind: 'identitytoolkit#VerifyPasswordResponse',
          localId: MOCK_USER.localId,
          email: MOCK_USER.email,
          displayName: MOCK_USER.displayName,
          idToken: MOCK_USER.idToken,
          registered: true,
          refreshToken: MOCK_USER.refreshToken,
          expiresIn: MOCK_USER.expiresIn,
        }
        await route.fulfill({ json })
      }
    )

    // Intercepts signup requests
    await page.route('**/identitytoolkit.googleapis.com/v1/accounts:signUp**', async (route) => {
      const json = {
        kind: 'identitytoolkit#SignupNewUserResponse',
        localId: MOCK_USER.localId,
        email: MOCK_USER.email,
        displayName: MOCK_USER.displayName,
        idToken: MOCK_USER.idToken,
        refreshToken: MOCK_USER.refreshToken,
        expiresIn: MOCK_USER.expiresIn,
      }
      await route.fulfill({ json })
    })

    // Intercepts token refresh/lookup (getAccountInfo)
    await page.route('**/identitytoolkit.googleapis.com/v1/accounts:lookup**', async (route) => {
      const json = {
        kind: 'identitytoolkit#GetAccountInfoResponse',
        users: [
          {
            localId: MOCK_USER.localId,
            email: MOCK_USER.email,
            displayName: MOCK_USER.displayName,
            emailVerified: false,
          },
        ],
      }
      await route.fulfill({ json })
    })

    // 2. Mock Backend API (User Sync)
    // The app calls this after login/signup to get profile data
    await page.route('**/api/users/sync', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: MOCK_BACKEND_USER,
        },
      })
    })

    // Navigate to auth page
    await page.goto('/auth')
  })

  test('successful login redirects to dashboard', async ({ page }) => {
    // Fill login form
    await page.getByPlaceholder('Email').fill('test@example.com')
    await page.getByPlaceholder('Password').fill('password123')

    // Click Sign In
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Expect redirect to dashboard (/)
    await expect(page).toHaveURL('/')

    // Verify authenticated state (e.g. Dashboard header)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

    // Verify toast or success message if any (optional)
  })

  test('failed login shows error message', async ({ page }) => {
    // Mock failure for this specific test
    await page.route(
      '**/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword**',
      async (route) => {
        await route.fulfill({
          status: 400,
          json: {
            error: {
              code: 400,
              message: 'INVALID_PASSWORD',
              errors: [
                {
                  message: 'INVALID_PASSWORD',
                  domain: 'global',
                  reason: 'invalid',
                },
              ],
            },
          },
        })
      }
    )

    await page.getByPlaceholder('Email').fill('test@example.com')
    await page.getByPlaceholder('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Verify error toast
    await expect(
      page.getByRole('alert').filter({ hasText: 'Sign in failed' }).first()
    ).toBeVisible()
    // Verify we are still on auth page
    await expect(page).toHaveURL(/\/auth/)
  })

  test('successful signup redirects to dashboard', async ({ page }) => {
    // Switch to Sign Up tab
    await page.getByRole('tab', { name: 'Sign Up' }).click()

    // Fill signup form
    await page.getByPlaceholder('Username').fill('TestUser')
    await page.getByPlaceholder('Email').fill('test@example.com')
    await page.getByPlaceholder('Password', { exact: true }).fill('password123')
    await page.getByPlaceholder('Confirm Password').fill('password123')

    // Click Sign Up
    await page.getByRole('button', { name: 'Sign Up' }).click()

    // Expect redirect to dashboard
    await expect(page).toHaveURL('/')

    // Verify toast
    await expect(
      page.getByRole('alert').filter({ hasText: 'Account created' }).first()
    ).toBeVisible()
  })

  test('password recovery flow', async ({ page }) => {
    // Mock password reset email request
    await page.route(
      '**/identitytoolkit.googleapis.com/v1/accounts:sendOobCode**',
      async (route) => {
        await route.fulfill({
          json: {
            kind: 'identitytoolkit#GetOobConfirmationCodeResponse',
            email: 'test@example.com',
          },
        })
      }
    )

    await page.getByText('Forgot Password?').click()
    await page.getByPlaceholder('Enter your email').fill('test@example.com')
    await page.getByRole('button', { name: 'Send Reset Link' }).click()

    // Verify success toast
    await expect(page.getByRole('alert').filter({ hasText: 'Email sent' }).first()).toBeVisible()
  })
})
