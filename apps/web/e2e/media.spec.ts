import { test, expect } from '@playwright/test'

/**
 * Media module E2E tests.
 *
 * All 8 media types share the same list/card/modal pattern.
 * Since all routes require authentication, unauthenticated users
 * are redirected to /auth. These tests verify:
 *   1. Each media route exists and responds
 *   2. The auth guard works for each route
 *   3. The auth page renders correctly after redirect
 */

const MEDIA_TYPES = [
  { path: '/anime', name: 'Anime', libraryTitle: 'Anime Library' },
  { path: '/manga', name: 'Manga', libraryTitle: 'Manga Library' },
  { path: '/light-novel', name: 'Light Novel', libraryTitle: 'Light Novel Library' },
  { path: '/fiction', name: 'Fiction', libraryTitle: 'Fiction Library' },
  { path: '/non-fiction', name: 'Non-Fiction', libraryTitle: 'Non-Fiction Library' },
  { path: '/game', name: 'Game', libraryTitle: 'Game Library' },
  { path: '/movie', name: 'Movie', libraryTitle: 'Movie Library' },
  { path: '/tv-series', name: 'TV Series', libraryTitle: 'TV Series Library' },
]

test.describe('Media Modules - Route Accessibility', () => {
  for (const media of MEDIA_TYPES) {
    test(`${media.name} page (${media.path}) redirects to auth when not logged in`, async ({
      page,
    }) => {
      await page.goto(media.path)
      await expect(page).toHaveURL(/\/auth/)
      await expect(page.getByText('Welcome')).toBeVisible()
    })
  }
})

test.describe('Auth Page - From Media Redirects', () => {
  test('auth page is functional after media redirect', async ({ page }) => {
    // Navigate to a media route, get redirected to auth
    await page.goto('/anime')
    await expect(page).toHaveURL(/\/auth/)

    // Verify the auth page is fully functional
    await expect(page.getByRole('tab', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Sign Up' })).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Google' })).toBeVisible()
  })

  test('can interact with sign up form after media redirect', async ({ page }) => {
    await page.goto('/manga')
    await expect(page).toHaveURL(/\/auth/)

    // Switch to sign up tab
    await page.getByRole('tab', { name: 'Sign Up' }).click()
    await expect(page.getByPlaceholder('Username')).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Confirm Password')).toBeVisible()
  })
})
